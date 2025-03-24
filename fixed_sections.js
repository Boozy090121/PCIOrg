// Section 1 - Around line 2370
      // Add role labels
      if (showRoles) {
        node.append("text")
          .attr("dx", d => d.children ? -8 : 8)
          .attr("dy", 18)
          .attr("text-anchor", d => d.children ? "end" : "start")
          .attr("font-size", "9px")
          .text(d => d.data.role || "")
          .style("fill", "#666");
      }

// Section 2 - Around line 2382
      // Add client labels
      if (showClients) {
        node.append("text")
          .attr("dx", d => d.children ? -8 : 8)
          .attr("dy", 30)
          .attr("text-anchor", d => d.children ? "end" : "start")
          .attr("font-size", "8px")
          .attr("font-style", "italic")
          .text(d => d.data.client || "")
          .style("fill", "#999");
      } 