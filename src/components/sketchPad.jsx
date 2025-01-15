import React, { useEffect, useRef, useState } from 'react';
import p5 from "p5";



const sketch = (p) => {
  let time = 0;
  let hWave = [];
  let vWave = [];
  let series = [1];
  let speedSlider;
  let depthSlider;
  let typeSelect;
  let pointsButton;
  let timeButton;
  let seriesInput;
  let seriesSubmit;
  let speedLabel;
  let depthLabel;
  let typeLabel;
  let seriesLabel;
  let resetAllButton;
  let backgroundColorLabel;
  let backgroundColorPicker;
  let drawColorLabel;
  let drawColorPicker;
  let showWaves;
  let showWavesButton;

  const resetPoints = () => {
    hWave = [];
    vWave = [];
  }
  const resetTime = () => {
    time = 0;
  }
  const submitSeries = () => {
    let split = seriesInput.value().split(",");
    series = split;
    resetPoints();
  }
  const resetAll = () => {
    resetTime();
    resetPoints();
  }
  const toggleWaves = () => {
    showWaves = !showWaves;
  }



  p.setup = () => {
    p.createCanvas(1600, 800);
    showWaves = true;

    speedLabel = p.createButton("Speed");
    speedSlider = p.createSlider(50, 100, 1);
    depthLabel = p.createButton("Depth");
    depthSlider = p.createSlider(1, 100, 10);
    typeLabel = p.createButton("Type");
    typeSelect = p.createSelect();
    typeSelect.changed(resetAll);

    typeSelect.option("series");
    typeSelect.option("square");
    typeSelect.option("sawtooth");

    seriesLabel = p.createButton("Series Input");
    seriesInput = p.createInput("", "text");
    seriesSubmit = p.createButton("submit");
    seriesSubmit.style("background", "lightgray");
    seriesSubmit.style("marginLeft", "1vw");
    seriesSubmit.style("marginRight", "10vw");
    seriesSubmit.mousePressed(submitSeries);

    showWavesButton = p.createButton("Toggle waves");
    showWavesButton.style("background", "lightgray");
    showWavesButton.mousePressed(toggleWaves)

    backgroundColorLabel = p.createButton("Background Color");
    backgroundColorPicker = p.createColorPicker("black");

    drawColorLabel = p.createButton("Draw Color");
    drawColorPicker = p.createColorPicker("yellow");

    pointsButton = p.createButton("reset points");
    pointsButton.style("background", "lightgray");
    pointsButton.style("margin", "0 .5vw");
    pointsButton.mousePressed(resetPoints);

    timeButton = p.createButton("reset time");
    timeButton.style("background", "lightgray");
    timeButton.style("margin", "0 .5vw");
    timeButton.mousePressed(resetTime);

    resetAllButton = p.createButton("reset all");
    resetAllButton.style("background", "lightgray");
    resetAllButton.style("margin", "0 .5vw");
    resetAllButton.mousePressed(resetAll);
  }

  return p.draw = () => {
    p.background(backgroundColorPicker.color());
    p.stroke(155);
    p.fill(155);
    p.textSize(20);

    let n = 1;
    p.translate(100, 100);
    let dotX = 0;
    let dotY = 0;
    let type = typeSelect.selected();

    if (typeSelect.value() === "series") {
      for (let i = 0; i < series.length; i++) {
        let prevX = dotX;
        let prevY = dotY;
        n = series[i];
        let radius = 50 * (4 / (n * Math.PI));
        dotX += radius * Math.cos(n * time);
        dotY += radius * Math.sin(n * time);
        if(showWaves){
          p.noFill();
          p.stroke(105);
          p.ellipse(prevX, prevY, radius * 2);
  
          p.fill(50, 100, 150);
          p.stroke(50, 100, 150);
          p.ellipse(prevX, prevY, 2);
          p.line(prevX, prevY, dotX, dotY);
        }
      }
    }
    else {
      for (let i = 0; i < depthSlider.value(); i++) {
        let prevX = dotX;
        let prevY = dotY;
        switch (type) {
          case "square":
            n = i * 2 + 1;
            break;
          case "sawtooth":
            n = i + 1;
            break;
        }
        let radius = 50 * (4 / (n * Math.PI));
        dotX += radius * Math.cos(n * time);
        dotY += radius * Math.sin(n * time);
        if(showWaves){
          p.noFill();
          p.stroke(105);
          p.ellipse(prevX, prevY, radius * 2);
  
          p.fill(50, 100, 150);
          p.stroke(50, 100, 150);
          p.ellipse(prevX, prevY, 2);
          p.line(prevX, prevY, dotX, dotY);
        }
      }


    }

    hWave.unshift(dotY);
    vWave.unshift(dotX);

    let offsetX = 150;
    let offsetY = 150;
    if (showWaves) {
      p.fill(50, 100, 150);
      p.stroke(50, 100, 150);
      p.ellipse(offsetX, dotY, 10);
      p.line(dotX, dotY, offsetX, dotY);

      p.ellipse(dotX, offsetY, 10);
      p.line(dotX, dotY, dotX, offsetY);

      p.beginShape();
      for (let i = 0; i < hWave.length; i++) {
        p.point(i / 2 + offsetX, hWave[i]);
        p.point(vWave[i], i / 2 + offsetY);
      }
      p.endShape();
    }

    p.beginShape();
    for (let i = 0; i < hWave.length; i++) {
      let c = p.color(255, 255, i % 255);
      p.stroke(drawColorPicker.color());
      p.point(vWave[i] + 800, hWave[i] + 300);
    }
    p.endShape();

    time -= .02 * speedSlider.value() / 100;

    if (vWave.length > 12500) vWave.pop();
    if (hWave.length > 21500) hWave.pop();
  }
}

const SketchPad = () => {
  const p5ContainerRef = useRef();

  useEffect(() => {
    const p5Instance = new p5(sketch, p5ContainerRef.current);
    return () => {
      p5Instance.remove();
    }
  }, []);

  return <div className='container' ref={p5ContainerRef} />
}

export default SketchPad;