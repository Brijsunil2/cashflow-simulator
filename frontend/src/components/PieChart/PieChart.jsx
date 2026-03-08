import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./PieChart.scss";

/**
 * Professional, Responsive Pie/Donut Chart Component
 * @param {Array} data - Array of { label, value, color }
 * @param {number} innerRadiusRatio - 0 for Pie, 0.5-0.7 for Donut
 * @param {string} title - Optional title inside/above
 */
const PieChart = ({ data = [], innerRadiusRatio = 0.6 }) => {
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [tooltip, setTooltip] = useState({ show: false, data: null, x: 0, y: 0 });

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
        svg.selectAll("*").remove();

        const isSmall = width < 300;
        const margin = 10;
        const radius = Math.min(width, height) / 2 - margin;
        const innerRadius = radius * innerRadiusRatio;

        const g = svg
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const pie = d3.pie()
            .value((d) => d.value)
            .sort(null)
            .padAngle(0.02);

        const arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(radius);

        const outerArc = d3.arc()
            .innerRadius(radius * 1.1)
            .outerRadius(radius * 1.1);

        const color = d3.scaleOrdinal()
            .domain(data.map((d) => d.label))
            .range(data.map((d, i) => d.color || d3.schemeTableau10[i % 10]));

        // Slices
        const slices = g
            .selectAll(".slice")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "slice");

        slices
            .append("path")
            .attr("d", arc)
            .attr("fill", (d) => color(d.data.label))
            .attr("stroke", "rgba(255,255,255,0.2)")
            .style("stroke-width", "1px")
            .style("transition", "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)")
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .attr("transform", "scale(1.03)")
                    .style("filter", "brightness(1.1)");

                const [x, y] = d3.pointer(event, containerRef.current);
                const total = d3.sum(data, d => d.value);
                const percent = (d.data.value / total) * 100;

                setTooltip({
                    show: true,
                    data: { ...d.data, percent: percent.toFixed(1) },
                    x,
                    y: y - 10
                });
            })
            .on("mousemove", function (event) {
                const [x, y] = d3.pointer(event, containerRef.current);
                setTooltip(prev => ({ ...prev, x, y: y - 10 }));
            })
            .on("mouseout", function () {
                d3.select(this)
                    .attr("transform", "scale(1)")
                    .style("filter", "none");
                setTooltip(prev => ({ ...prev, show: false }));
            });

        // Center Labels (Donut)
        if (innerRadiusRatio > 0) {
            const total = d3.sum(data, d => d.value);

            const summaryGroup = g.append("g").attr("class", "chart-center-text");

            summaryGroup.append("text")
                .attr("text-anchor", "middle")
                .attr("dy", "-0.2em")
                .attr("class", "center-label")
                .text("Total");

            summaryGroup.append("text")
                .attr("text-anchor", "middle")
                .attr("dy", "1.1em")
                .attr("class", "center-value")
                .text(`$${total.toLocaleString()}`);
        }


    }, [dimensions, data, innerRadiusRatio]);

    return (
        <div className="pie-chart-root" ref={containerRef}>
            <div className="pie-chart-main">
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                    preserveAspectRatio="xMidYMid meet"
                ></svg>
            </div>

            {tooltip.show && (
                <div
                    className="chart-tooltip"
                    style={{
                        left: tooltip.x,
                        top: tooltip.y,
                    }}
                >
                    <div className="tooltip-header">
                        <span className="tooltip-dot" style={{ backgroundColor: tooltip.data.color }}></span>
                        <span className="tooltip-label">{tooltip.data.label}</span>
                    </div>
                    <div className="tooltip-body">
                        <span className="tooltip-value">${tooltip.data.value.toLocaleString()}</span>
                        <span className="tooltip-percent">{tooltip.data.percent}%</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PieChart;
