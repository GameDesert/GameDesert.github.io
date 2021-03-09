import d3 from 'd3';
import {tileSize, tileHelperWidth, tileHelperHeight} from './config';

// shamelessly stolen from https://bl.ocks.org/mbostock/7555321
const wrap = (text, width) => {
  text.each(function() {
    const text = d3.select(this);
    const words = text.text().split(/\s+/).reverse();
    let word;
    let line = [];
    let lineNumber = 0;
    const lineHeight = 1.1; // ems
    const x = text.attr('x') || 0;
    const y = text.attr('y') || 0;
    const dy = parseFloat(text.attr('dy')) || 0;
    let tspan = text.text(null).append('tspan')
      .attr('x', x)
      .attr('y', y)
      .attr('dy', dy + 'em');
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text.append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', ++lineNumber * lineHeight + dy + 'em')
          .text(word);
      }
    }
  });
}

export class TileHelper {
  constructor(svg, bareBoard, game) {
    this.svg = svg;
    this.game = game;
    this.width = tileHelperWidth * tileSize;
    this.height = tileHelperHeight * tileSize;

    // NOTE this is a bit problematic as it depends on the level
    this.shiftX = (bareBoard.level.width + 1) * tileSize;
    const marginForAnimationControls = 2.5;
    this.shiftY = (bareBoard.level.height
                   - tileHelperHeight
                   - marginForAnimationControls) * tileSize;
    this.initialDraw();
  }

  initialDraw() {

    // Reset element
    this.svg.select('.helper').remove();

    // Create
    this.helperGroup = this.svg
      .append('g')
        .attr('class', 'helper')
        .attr('transform', `translate(${this.shiftX},${this.shiftY})`);

    this.helperGroup.append('rect')
      .attr('class', 'svg-interface-box-stroke')
      .attr('width', `${this.width}`)
      .attr('height', `${this.height}`);

    this.tileBackground = this.helperGroup.append('rect')
      .attr('class', 'background-tile')
      .attr('x', '1')
      .attr('y', '1')
      .attr('width', '98')
      .attr('height', '98');

    this.tileUse = this.helperGroup.append('use')
      .attr('class', 'element helper-element')
      .attr('x', tileSize / 2)
      .attr('y', tileSize / 2);

    this.tileName = this.helperGroup.append('text')
      .attr('class', 'helper-name unselectable')
      .attr('x', 2.25 * tileSize)
      .attr('y', tileSize * 0.4); // 0.5 factor might be too much for 3 lines

    this.tileSummmary = this.helperGroup.append('text')
      .attr('class', 'helper-summary unselectable')
      .attr('x', 0.25 * tileSize)
      .attr('y', 1.5 * tileSize);

    this.helperHitbox = this.helperGroup.append('rect')
      .attr('class', 'helper-hitbox')
      .attr('width', `${this.width}`)
      .attr('height', `${this.height}`);

  }

  show(tile) {

    this.helperHitbox.on('click', () => {
      this.game.setEncyclopediaItem(tile.tileName);
      this.game.setView('encyclopediaItem');
    });
    this.tileUse.attr('xlink:href', `#${tile.type.svgName}`)
    this.tileName.text(tile.type.desc.name)
      .call(wrap, (tileHelperWidth - 2) * tileSize);
    this.tileSummmary.text(tile.type.desc.summary)
      .call(wrap, (tileHelperWidth - 0.5) * tileSize);

  }

}
