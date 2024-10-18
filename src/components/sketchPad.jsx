import React, { useEffect, useRef, useState } from 'react';
import p5 from "p5";



const sketch = (p) => {
  let time = 0;
  const hWave = [];
  const vWave = [];
  const series = [1,2,3,4,5,6,7,8,9,10];
  let seriesSlider;
  let typeSelect;

  p.setup = () => {
    p.createCanvas(1600,800);
    seriesSlider = p.createSlider(1,100,10);
    typeSelect = p.createSelect();

    typeSelect.option("square");
    typeSelect.option("sawtooth");
  }
  
  return p.draw = () => {
    p.background(0);
    let n=1;
    p.translate(200,200);
    let dotX=0;
    let dotY=0;
    let type = typeSelect.selected();

    for(let i=0; i<seriesSlider.value(); i++){
      let prevX = dotX;
      let prevY = dotY;
      switch(type){
        case "square":
          n = i * 2 + 1;
          break;
        case "sawtooth":
          n = i+1;
          break;
      }
      
      let radius = 100 * (4/(n*Math.PI));
      dotX += radius * Math.cos(n*time);
      dotY += radius * Math.sin(n*time);
      p.noFill();
      p.stroke(105);
      p.ellipse(prevX,prevY,radius*2);
  
      p.fill(50,100,150);
      p.stroke(50,100,150);
      p.ellipse(prevX,prevY,2);
      p.line(prevX,prevY,dotX,dotY);
  
    }

    hWave.unshift(dotY);
    vWave.unshift(dotX);

    let offsetX = 150;
    let offsetY = 150;
    p.fill(50,100,150);
    p.stroke(50,100,150);
    p.ellipse(offsetX,dotY,10);
    p.line(dotX,dotY,offsetX,dotY);

    p.ellipse(dotX,offsetY,10);
    p.line(dotX,dotY,dotX,offsetY);
    // p.line(offsetX,dotY,dotX,offsetY);

    p.beginShape();
    for(let i=0; i<hWave.length; i++){
      p.point(i/2+offsetX,hWave[i]); 
      p.point(vWave[i],i/2+offsetY);
    }
    p.endShape();

    time -= .02;

    if(vWave.length > 1250) vWave.pop();
    if(hWave.length > 2150) hWave.pop();
  }
}

const SketchPad = () => {
  const p5ContainerRef = useRef();

  useEffect(() => {
    const p5Instance = new p5(sketch, p5ContainerRef.current);
    return () => {
      p5Instance.remove();
    }
  },[]);

  return <div className='container' ref={p5ContainerRef} />
}

export default SketchPad;