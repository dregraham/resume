import React, { useRef, useEffect, useState } from "react";
import "./styles.css";

const API_ENDPOINT = 'https://ckx7nhnyf2.execute-api.us-east-2.amazonaws.com/Production';

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
  const loadingRef = useRef(null);
  const resultsContainerRef = useRef(null);

  const [selectedColor, setSelectedColor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to draw the color wheel
  function drawColorWheel(canvas, ctx) {
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
      if (
        dist >= arc.innerRadius &&
        dist <= arc.outerRadius &&
        angle >= arc.start &&
        angle <= arc.end
      ) {
        setSelectedColor(arc.hex);
        if (selectedColorRef.current) selectedColorRef.current.style.backgroundColor = arc.hex;
        if (colorInfoRef.current) colorInfoRef.current.textContent = `Selected: ${arc.name}`;
        if (voteButtonRef.current) voteButtonRef.current.disabled = false;
        break;
      }
    }
  }

  // Send vote to API
  async function sendVote() {
    if (!selectedColor) {
      alert('Please select a color first');
      return;
    }
    const colorValue = selectedColor.substring(1);

    try {
      setIsLoading(true);
      if (voteButtonRef.current) voteButtonRef.current.disabled = true;

      const response = await fetch(`${API_ENDPOINT}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          color: colorValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const colorObj = rainbowColors.find(c => c.hex.toUpperCase() === selectedColor.toUpperCase());
      const colorName = colorObj ? colorObj.name : selectedColor;
      alert(`${colorName} has been added to the voting results!`);

      await getVotingResults();
    } catch (error) {
      console.error('Error sending vote:', error);
      alert('Failed to send vote. Please try again.');
    } finally {
      setIsLoading(false);
      if (voteButtonRef.current) voteButtonRef.current.disabled = false;
    }
  }

  // Get current voting results
  async function getVotingResults() {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_ENDPOINT}/votes`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      displayResults(data);
    } catch (error) {
      console.error('Error getting results:', error);
      if (resultsContainerRef.current) {
        resultsContainerRef.current.innerHTML = '<p>Failed to load results</p>';
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Display voting results as a rainbow
  function displayResults(data) {
    if (!resultsContainerRef.current) return;
    let oldCanvas = document.getElementById('rainbowResultsCanvas');
    if (oldCanvas) oldCanvas.remove();

    let tooltip = document.getElementById('rainbowTooltip');
    if (tooltip) tooltip.remove();

    let totalVotes = 0;
    for (const color in data) totalVotes += data[color];

    const sortedColors = rainbowColors.map(c => {
      const hex = c.hex.replace('#', '').toUpperCase();
      const key = Object.keys(data).find(k => k.toUpperCase() === hex) || hex;
      return {
        ...c,
        votes: data[key] || 0,
        hexKey: key
      };
    });

    const width = 500;
    const height = 250;
    const centerX = width / 2;
    const centerY = height * 1.1;
    const outerRadius = height * 0.95;
    const innerRadius = height * 0.45;

    const canvas = document.createElement('canvas');
    canvas.id = 'rainbowResultsCanvas';
    canvas.width = width;
    canvas.height = height;
    resultsContainerRef.current.innerHTML = '';
    resultsContainerRef.current.appendChild(canvas);

    tooltip = document.createElement('div');
    tooltip.id = 'rainbowTooltip';
    document.body.appendChild(tooltip);

    let startAngle = Math.PI;
    const ctx = canvas.getContext('2d');
    canvas._arcs = [];
    sortedColors.forEach((colorObj) => {
      const votes = colorObj.votes;
      if (votes === 0) return;
      const percentage = totalVotes > 0 ? votes / totalVotes : 0;
      const arcAngle = Math.PI * percentage;
      const hexColor = colorObj.hex;

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + arcAngle, false);
      ctx.arc(centerX, centerY, innerRadius, startAngle + arcAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = hexColor;
      ctx.fill();

      canvas._arcs.push({
        start: startAngle,
        end: startAngle + arcAngle,
        color: hexColor,
        name: colorObj.name,
        votes: votes
      });

      startAngle += arcAngle;
    });

    canvas.addEventListener('mousemove', function (e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let angle = Math.atan2(dy, dx);
      if (angle < 0) angle += 2 * Math.PI;

      let found = false;
      if (
        dist >= innerRadius &&
        dist <= outerRadius &&
        angle >= Math.PI &&
        angle <= 2 * Math.PI &&
        canvas._arcs
      ) {
        for (const arc of canvas._arcs) {
          if (angle >= arc.start && angle <= arc.end) {
            tooltip.style.display = 'block';
            tooltip.textContent = `${arc.name}: ${arc.votes} vote${arc.votes === 1 ? '' : 's'}`;
            tooltip.style.left = (e.pageX + 10) + 'px';
            tooltip.style.top = (e.pageY - 10) + 'px';
            found = true;
            break;
          }
        }
      }
      if (!found) {
        tooltip.style.display = 'none';
      }
    });

    canvas.addEventListener('mouseleave', function () {
      tooltip.style.display = 'none';
    });
  }

  // Setup color wheel and results on mount
  useEffect(() => {
    // Color Wheel
    if (colorWheelRef.current) {
      colorWheelRef.current.innerHTML = '';
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      colorWheelRef.current.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      drawColorWheel(canvas, ctx);

      // Tooltip
      let wheelTooltip = document.getElementById('colorWheelTooltip');
      if (!wheelTooltip) {
        wheelTooltip = document.createElement('div');
        wheelTooltip.id = 'colorWheelTooltip';
        wheelTooltip.style.position = 'absolute';
        wheelTooltip.style.display = 'none';
        wheelTooltip.style.background = '#222';
        wheelTooltip.style.color = '#fff';
        wheelTooltip.style.padding = '4px 10px';
        wheelTooltip.style.borderRadius = '5px';
        wheelTooltip.style.fontSize = '16px';
        wheelTooltip.style.pointerEvents = 'none';
        wheelTooltip.style.zIndex = 1000;
        document.body.appendChild(wheelTooltip);
      }

      canvas.addEventListener('mousemove', function (event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const dx = x - 150;
        const dy = y - 180;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let angle = Math.atan2(dy, dx);
        if (angle < 0) angle += 2 * Math.PI;

        let found = false;
        for (const arc of ctx._rainbowArcs) {
          if (
            dist >= arc.innerRadius &&
            dist <= arc.outerRadius &&
            angle >= arc.start &&
            angle <= arc.end
          ) {
            wheelTooltip.style.display = 'block';
            wheelTooltip.textContent = arc.name;
            wheelTooltip.style.left = (event.pageX + 10) + 'px';
            wheelTooltip.style.top = (event.pageY - 10) + 'px';
            found = true;
            break;
          }
        }
        if (!found) {
          wheelTooltip.style.display = 'none';
        }
      });

      canvas.addEventListener('mouseleave', function () {
        wheelTooltip.style.display = 'none';
      });

      canvas.addEventListener('click', (e) => handleColorSelection(e, ctx));
    }

    // Results
    getVotingResults();

    // Cleanup tooltips on unmount
    return () => {
      let wheelTooltip = document.getElementById('colorWheelTooltip');
      if (wheelTooltip) wheelTooltip.remove();
      let rainbowTooltip = document.getElementById('rainbowTooltip');
      if (rainbowTooltip) rainbowTooltip.remove();
    };
    // eslint-disable-next-line
  }, []);

  // Disable vote button if no color selected
  useEffect(() => {
    if (voteButtonRef.current) {
      voteButtonRef.current.disabled = !selectedColor;
    }
    if (!selectedColor && selectedColorRef.current) {
      selectedColorRef.current.style.backgroundColor = "#fff";
    }
  }, [selectedColor]);

  return (
    <div style={{ padding: 20 }}>
      <button
        style={{
          position: "absolute",
          top: 20,
          right: 30,
          zIndex: 2000,
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "10px 18px",
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          transition: "background 0.2s",
        }}
        onClick={() => {
          // Download functionality can be implemented here if needed
        }}
      >
        Download This Project
      </button>
      <h1>Pick Your Favorite Color!</h1>
      <div id="colorWheel" ref={colorWheelRef}></div>
      <div id="selectedColor" ref={selectedColorRef}></div>
      <div id="colorInfo" ref={colorInfoRef}>No color selected</div>
      <button id="voteButton" ref={voteButtonRef} onClick={sendVote}>Submit</button>
      <div id="loading" ref={loadingRef} className="loading" style={{ display: isLoading ? "block" : "none" }}>Loading...</div>
      <div id="results">
        <h2>Vote Results</h2>
        <div id="resultsContainer" ref={resultsContainerRef}></div>
      </div>
      {/* Tools Used Section */}
      <div id="toolsUsed" style={{
        margin: "30px 0",
        width: "80%",
        maxWidth: 600,
        background: "#fffbe7",
        borderRadius: 10,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        padding: 20
      }}>
        <h2 style={{ marginTop: 0 }}>Tools Used</h2>
        <ul style={{ fontSize: 17, color: "#444", lineHeight: 1.7 }}>
          <li>HTML5 &amp; CSS3</li>
          <li>Vanilla JavaScript (ES6+)</li>
          <li>Canvas API (for drawing rainbow and results)</li>
          <li>AWS Lambda &amp; API Gateway (for backend API)</li>
          <li>AWS DynamoDB (for vote storage)</li>
          <li>Fetch API (for HTTP requests)</li>
          <li>VS Code (for development)</li>
        </ul>
      </div>
    </div>
  );
}

export default ColorVotingAPI;