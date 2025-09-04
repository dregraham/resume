import React, { useRef, useEffect, useState } from "react";

const API_ENDPOINT = "https://ckx7nhnyf2.execute-api.us-east-2.amazonaws.com/Production";

const rainbowColors = [
  { name: 'Red', hex: '#FF0000' },
  { name: 'Orange', hex: '#FF7F00' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Chartreuse Green', hex: '#7FFF00' },
  { name: 'Green', hex: '#00FF00' },
  { name: 'Spring Green', hex: '#00FF7F' },
  { name: 'Cyan', hex: '#00FFFF' },
  { name: 'Azure', hex: '#007FFF' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Violet', hex: '#8B00FF' },
  { name: 'Magenta', hex: '#FF00FF' },
  { name: 'Rose', hex: '#FF007F' }
];

function ColorVotingAPI() {
  const colorWheelRef = useRef(null);
  const selectedColorRef = useRef(null);
  const colorInfoRef = useRef(null);
  const voteButtonRef = useRef(null);
  const resultsContainerRef = useRef(null);

  const [selectedColor, setSelectedColor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to draw the color wheel
  function drawColorWheel(ctx) {
    ctx.clearRect(0, 0, 300, 300);
    const arcWidth = 40;
    const outerRadius = 140;
    const innerRadius = outerRadius - arcWidth;
    const centerX = 150;
    const centerY = 180;
    const total = rainbowColors.length;
    const startAngle = Math.PI;
    const endAngle = 2 * Math.PI;
    const angleStep = (endAngle - startAngle) / total;
    ctx._rainbowArcs = [];

    for (let i = 0; i < total; i++) {
      const color = rainbowColors[i];
      const arcStart = startAngle + i * angleStep;
      const arcEnd = arcStart + angleStep;

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, arcStart, arcEnd, false);
      ctx.arc(centerX, centerY, innerRadius, arcEnd, arcStart, true);
      ctx.closePath();
      ctx.fillStyle = color.hex;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx._rainbowArcs.push({
        start: arcStart,
        end: arcEnd,
        innerRadius,
        outerRadius,
        hex: color.hex,
        name: color.name
      });
    }
  }

  // Handle color selection
  function handleColorSelection(event, ctx) {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const dx = x - 150;
    const dy = y - 180;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let angle = Math.atan2(dy, dx);
    if (angle < 0) angle += 2 * Math.PI;

    for (const arc of ctx._rainbowArcs) {
      if (dist >= arc.innerRadius && dist <= arc.outerRadius && angle >= arc.start && angle <= arc.end) {
        setSelectedColor(arc.hex);
        if (selectedColorRef.current) selectedColorRef.current.style.backgroundColor = arc.hex;
        if (colorInfoRef.current) colorInfoRef.current.textContent = `Selected: ${arc.name}`;
        break;
      }
    }
  }

  // Send vote to API
  async function sendVote() {
    if (!selectedColor) return;
    const colorValue = selectedColor.substring(1);
    try {
      setIsLoading(true);
      if (voteButtonRef.current) voteButtonRef.current.disabled = true;
      const response = await fetch(`${API_ENDPOINT}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ color: colorValue })
      });
      if (!response.ok) throw new Error("Vote request failed");
      await getVotingResults();
    } catch (e) {
      console.error(e);
      alert("Failed to send vote.");
    } finally {
      setIsLoading(false);
      if (voteButtonRef.current) voteButtonRef.current.disabled = false;
    }
  }

  // Get current voting results
  async function getVotingResults() {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_ENDPOINT}/votes`, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("Results request failed");
      const data = await response.json();
      displayResults(data);
    } catch (e) {
      console.error(e);
      if (resultsContainerRef.current) resultsContainerRef.current.innerHTML = "<p>Failed to load results</p>";
    } finally {
      setIsLoading(false);
    }
  }

  // Display voting results as a rainbow
  function displayResults(data) {
    if (!resultsContainerRef.current) return;
    const old = document.getElementById("rainbowResultsCanvas");
    if (old) old.remove();

    let totalVotes = 0;
    for (const k in data) totalVotes += data[k];

    const sorted = rainbowColors.map(c => {
      const hexUpper = c.hex.replace("#", "").toUpperCase();
      const key = Object.keys(data).find(k => k.toUpperCase() === hexUpper) || hexUpper;
      return { ...c, votes: data[key] || 0 };
    });

    const width = 500;
    const height = 250;
    const centerX = width / 2;
    const centerY = height * 1.1;
    const outerRadius = height * 0.95;
    const innerRadius = height * 0.45;

    const canvas = document.createElement("canvas");
    canvas.id = "rainbowResultsCanvas";
    canvas.width = width;
    canvas.height = height;
    resultsContainerRef.current.innerHTML = "";
    resultsContainerRef.current.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    canvas._arcs = [];
    let startAngle = Math.PI;

    sorted.forEach(c => {
      if (c.votes === 0) return;
      const pct = totalVotes > 0 ? c.votes / totalVotes : 0;
      const arcAngle = Math.PI * pct;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + arcAngle, false);
      ctx.arc(centerX, centerY, innerRadius, startAngle + arcAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = c.hex;
      ctx.fill();
      canvas._arcs.push({ start: startAngle, end: startAngle + arcAngle, color: c.hex, name: c.name, votes: c.votes });
      startAngle += arcAngle;
    });

    canvas.addEventListener("mousemove", e => {
      const tooltip = ensureTooltip("rainbowTooltip");
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let angle = Math.atan2(dy, dx);
      if (angle < 0) angle += 2 * Math.PI;

      if (dist >= innerRadius && dist <= outerRadius && angle >= Math.PI && angle <= 2 * Math.PI) {
        const arc = canvas._arcs.find(a => angle >= a.start && angle <= a.end);
        if (arc) {
          tooltip.style.display = "block";
          tooltip.textContent = `${arc.name}: ${arc.votes} vote${arc.votes === 1 ? "" : "s"}`;
          tooltip.style.left = e.pageX + 10 + "px";
          tooltip.style.top = e.pageY - 10 + "px";
          return;
        }
      }
      tooltip.style.display = "none";
    });

    canvas.addEventListener("mouseleave", () => {
      const t = document.getElementById("rainbowTooltip");
      if (t) t.style.display = "none";
    });
  }

  function ensureTooltip(id) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      el.className = "tooltip";
      document.body.appendChild(el);
    }
    return el;
  }

  // Setup color wheel and results on mount
  useEffect(() => {
    // Color Wheel
    if (colorWheelRef.current) {
      colorWheelRef.current.innerHTML = "";
      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 300;
      colorWheelRef.current.appendChild(canvas);
      const ctx = canvas.getContext("2d");
      drawColorWheel(ctx);

      canvas.addEventListener("mousemove", e => {
        const tooltip = ensureTooltip("colorWheelTooltip");
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const dx = x - 150;
        const dy = y - 180;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let angle = Math.atan2(dy, dx);
        if (angle < 0) angle += 2 * Math.PI;

        let hit = null;
        for (const arc of ctx._rainbowArcs) {
          if (dist >= arc.innerRadius && dist <= arc.outerRadius && angle >= arc.start && angle <= arc.end) {
            hit = arc;
            break;
          }
        }
        if (hit) {
          tooltip.style.display = "block";
            tooltip.textContent = hit.name;
            tooltip.style.left = e.pageX + 10 + "px";
            tooltip.style.top = e.pageY - 10 + "px";
        } else {
          tooltip.style.display = "none";
        }
      });

      canvas.addEventListener("mouseleave", () => {
        const t = document.getElementById("colorWheelTooltip");
        if (t) t.style.display = "none";
      });

      canvas.addEventListener("click", e => handleColorSelection(e, ctx));
    }
    getVotingResults();
    return () => {
      ["colorWheelTooltip", "rainbowTooltip"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Disable vote button if no color selected
  useEffect(() => {
    if (voteButtonRef.current) voteButtonRef.current.disabled = !selectedColor;
    if (!selectedColor && selectedColorRef.current) {
      selectedColorRef.current.style.backgroundColor = "#fff";
    }
  }, [selectedColor]);

  return (
    <div className="app-container">
      <h1>Pick Your Favorite Color!</h1>
      <div id="colorWheel" ref={colorWheelRef}></div>
      <div id="selectedColor" ref={selectedColorRef}></div>
      <div id="colorInfo" ref={colorInfoRef}>No color selected</div>
      <button id="voteButton" ref={voteButtonRef} onClick={sendVote}>Submit</button>
      {isLoading && <div className="loading">Loading...</div>}
      <div id="results">
        <h2>Vote Results</h2>
        <div id="resultsContainer" ref={resultsContainerRef}></div>
      </div>
      <div id="toolsUsed" className="tools">
        <h2>Tools Used</h2>
        <ul>
          <li>React (Hooks)</li>
          <li>Canvas API</li>
          <li>AWS Lambda & API Gateway</li>
          <li>DynamoDB</li>
          <li>Fetch API</li>
        </ul>
      </div>
    </div>
  );
}

export default ColorVotingAPI;