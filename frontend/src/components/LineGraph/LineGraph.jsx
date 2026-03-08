import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./LineGraph.scss";

/**
 * Professional, Responsive Line Graph Component
 * @param {Array} data - Array of series objects: [{ id: "Income", color: "#10b981", data: [{x: Date, y: number}, ...] }]
 * @param {string} xAxisFormat - Passed to d3 timeFormat or format (e.g., "%b %d")
 * @param {string} yAxisFormat - Passed to d3 format (e.g., "$.2s")
 */
const LineGraph = ({ data = [], xAxisFormat = "%b", yAxisFormat = "$.2s" }) => {
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [tooltip, setTooltip] = useState({ show: false, content: null, x: 0, y: 0 });

    // Handle responsiveness
    useEffect(() => {
        const observeTarget = containerRef.current;
        if (!observeTarget) return;

        const resizeObserver = new ResizeObserver((entries) => {
            if (!entries[0]) return;
            const { width, height } = entries[0].contentRect;
            setDimensions({ width, height });
        });

        resizeObserver.observe(observeTarget);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        const { width, height } = dimensions;
        if (width === 0 || height === 0 || !data.length) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous render

        const margin = { top: 20, right: 20, bottom: 30, left: 50 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Flatten all data points to find global domains
        const allPoints = data.flatMap(series => series.data);
        if (allPoints.length === 0) return;

        const isDateX = allPoints[0].x instanceof Date;

        // X Scale (add padding so lines don't hug the edges)
        const xScale = (isDateX ? d3.scaleTime() : d3.scalePoint())
            .domain(d3.extent(allPoints, d => d.x))
            .range([15, innerWidth - 15]);

        // Y Scale (extend slightly above max and below min for headroom)
        const yMax = d3.max(allPoints, d => d.y);
        const yMin = d3.min(allPoints, d => d.y);

        // Ensure the domain floor goes below 0 if we have negative values, otherwise pad slightly below the minimum positive value or stick to 0.
        const yDomainFloor = yMin < 0 ? yMin * 1.1 : Math.min(0, yMin * 0.9);
        const yDomainCeiling = yMax > 0 ? yMax * 1.1 : Math.max(0, yMax * 0.9);

        const yScale = d3.scaleLinear()
            .domain([yDomainFloor, yDomainCeiling])
            .range([innerHeight, 0]);

        const group = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // X Axis removed as per user request (hover handles time feedback)    

        // Y Axis (keeping grid lines)
        const yAxis = d3.axisLeft(yScale)
            .ticks(Math.min(innerHeight / 40, 6))
            .tickSize(-innerWidth); // Grid lines spanning across

        if (yAxisFormat) {
            yAxis.tickFormat(d3.format(yAxisFormat));
        }

        group.append("g")
            .attr("class", "line-graph-axis y-axis")
            .call(yAxis);

        // Line Generator
        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(d3.curveMonotoneX); // Smooth curves

        // Draw Lines
        const seriesGroup = group.selectAll(".series")
            .data(data)
            .enter().append("g")
            .attr("class", "series");

        seriesGroup.append("path")
            .attr("class", "line-graph-path")
            .attr("d", d => line(d.data))
            .style("stroke", d => d.color || "#3b82f6");

        // Interaction Overlay (Voronoi or Rect)
        // For simplicity and multi-series, we use a single rect and find nearest points
        group.append("rect")
            .attr("width", innerWidth)
            .attr("height", innerHeight)
            .attr("fill", "transparent")
            .on("mousemove", function (event) {
                const [mouseX] = d3.pointer(event);

                // Find nearest X value
                let nearestXValue;
                if (isDateX) {
                    nearestXValue = xScale.invert(mouseX);
                } else {
                    const domain = xScale.domain();
                    const range = xScale.range();
                    const rangePoints = d3.range(range[0], range[1], xScale.step());
                    const i = d3.bisectCenter(rangePoints, mouseX);
                    nearestXValue = domain[i];
                }

                // Gather points for this X value across all series
                const tooltipData = {
                    x: nearestXValue,
                    points: []
                };

                // Simple proximity search (can be optimized)
                data.forEach(series => {
                    // Find closest point by X
                    let closest = null;
                    let minDiff = Infinity;

                    series.data.forEach(p => {
                        const diff = isDateX ? Math.abs(p.x.getTime() - nearestXValue.getTime()) : Math.abs(xScale(p.x) - mouseX);
                        if (diff < minDiff) {
                            minDiff = diff;
                            closest = p;
                        }
                    });

                    // If it's close enough (e.g., within 1 day or a threshold), include it
                    if (closest) {
                        tooltipData.points.push({
                            id: series.id,
                            color: series.color,
                            value: closest.y
                        });
                    }
                });

                if (tooltipData.points.length > 0) {
                    // Position tooltip near mouse but use snapped X coordinate
                    const snapedX = isDateX ? xScale(nearestXValue) : xScale(nearestXValue);
                    // Use average Y of points or just mouse Y for tooltip placement
                    const mouseY = d3.pointer(event)[1];

                    setTooltip({
                        show: true,
                        content: tooltipData,
                        x: snapedX + margin.left,
                        y: mouseY + margin.top - 20
                    });
                } else {
                    setTooltip(prev => ({ ...prev, show: false }));
                }
            })
            .on("mouseout", () => {
                setTooltip(prev => ({ ...prev, show: false }));
            });

    }, [dimensions, data, xAxisFormat, yAxisFormat]);

    return (
        <div className="line-graph-root" ref={containerRef}>
            <div className="line-graph-main">
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                    preserveAspectRatio="xMidYMid meet"
                ></svg>
            </div>

            {tooltip.show && tooltip.content && (
                <div
                    className="chart-tooltip"
                    style={{
                        left: tooltip.x,
                        top: tooltip.y,
                    }}
                >
                    <div className="tooltip-header" style={{ marginBottom: "8px" }}>
                        <span className="tooltip-label">
                            {tooltip.content.x instanceof Date
                                ? tooltip.content.x.toLocaleDateString()
                                : String(tooltip.content.x)}
                        </span>
                    </div>
                    {tooltip.content.points.map((pt, i) => (
                        <div key={i} className="tooltip-body" style={{ marginBottom: "4px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span className="tooltip-dot" style={{ backgroundColor: pt.color }}></span>
                                <span className="tooltip-label" style={{ fontSize: "0.8rem", color: "#4b5563", textTransform: "none" }}>{pt.id}</span>
                            </div>
                            <span className="tooltip-value" style={{ fontSize: "0.9rem" }}>${pt.value.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LineGraph;
