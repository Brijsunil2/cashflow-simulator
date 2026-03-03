import { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./PieChart.scss";

const PieChart = ({ data, width = 300, height = 300, innerRadius = 0 }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (!data || data.length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const radius = Math.min(width, height) / 2;
        const g = svg
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const pie = d3.pie().value((d) => d.value).sort(null);

        const arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(radius * 0.8);

        const outerArc = d3.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9);

        const color = d3.scaleOrdinal()
            .domain(data.map((d) => d.label))
            .range(data.map((d) => d.color || d3.interpolateSpectral(data.indexOf(d) / data.length)));

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
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 0.8)
            .on("mouseover", function () {
                d3.select(this).style("opacity", 1).style("cursor", "pointer");
            })
            .on("mouseout", function () {
                d3.select(this).style("opacity", 0.8);
            });

        // Labels & Lines
        const total = d3.sum(data, (d) => d.value);

        slices
            .append("text")
            .attr("transform", (d) => {
                const pos = outerArc.centroid(d);
                const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
                return `translate(${pos})`;
            })
            .attr("dy", ".35em")
            .style("text-anchor", (d) => {
                const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                return midAngle < Math.PI ? "start" : "end";
            })
            .text((d) => {
                const percent = (d.data.value / total) * 100;
                return `${d.data.label} (${percent.toFixed(1)}%)`;
            })
            .style("font-size", "12px")
            .style("font-weight", "600")
            .style("fill", "#4b5563");

        slices
            .append("polyline")
            .attr("points", (d) => {
                const pos = outerArc.centroid(d);
                const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                pos[0] = radius * 0.9 * (midAngle < Math.PI ? 1 : -1);
                return [arc.centroid(d), outerArc.centroid(d), pos];
            })
            .style("fill", "none")
            .style("stroke", "#cbd5e1")
            .style("stroke-width", "1px")
            .style("opacity", 0.5);

    }, [data, width, height, innerRadius]);

    return (
        <div className="pie-chart-container">
            <svg ref={svgRef} width={width} height={height}></svg>
        </div>
    );
};

export default PieChart;
