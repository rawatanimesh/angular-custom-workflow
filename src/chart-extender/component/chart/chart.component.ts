import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Icons} from './icon';
// import { CommonService } from 'libs/core/src/lib/services/common/common.service';

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, AfterViewInit, OnChanges {
  boxInfo = [
  //   {
  //   id: 1,
  //   footerText: '1',
  //   text: 'Site Coverage Check',
  //   icon: 'flag',
  //   color: 'green',
  //   x: 350,
  //   y: 50,
  // }
  ];
  type = 'rcp';
  icons = Icons.icon;
  mouseX = 0;
  mouseY = 0;
  isDraw = false;
  newItem = {
    id: 0,
    footerText: '',
    text: '',
    icon: 'flag',
    color: 'green',
    x: 50,
    y: 50,
  };
  showModal = false;
  iconModal = false;
  errorText = '';
  lineInfo: any[] = [];
  canvas: any;
  source: any;
  boxId = 0;
  lineId = 0;
  isEdit = false;
  canvasId;
  lineColor = '#282828';
  lineWidth = 2;
  breakLine = false;
  canvasBoxId;
  connections = [];
  boxSize = {
    width: 120,
    height: 90
  };
  lineData: any[] = [];
  @Input() state = 'create'; // can be preview only for showing chart
  @Input() chartData: any; // = {boxInfo: {}, lineInfo: {}};
  @Output() chartResult = new EventEmitter(); // can be preview only for showing chart
  constructor(
    // private common: CommonService
  ) {
  }

  ngOnChanges(changes) {
    console.log(changes);
    if (changes.hasOwnProperty('state') && this.state === 'create') {
      this.ngAfterViewInit();
    }
    // todo should check and test with real data
    if (this.chartData) {
      this.lineInfo = this.chartData.lineInfo;
      this.boxInfo = this.chartData.boxInfo;
      if (this.lineInfo) {
        this.redrawCanvas();
      }
      console.log('running...', this.type);
    }
  }

  ngOnInit() {
    this.canvasBoxId = this.generateRandomString();
    this.canvasId = this.generateRandomString();

    this.initiateData();

    // this.autoInit();
  }

  ngAfterViewInit() {
    const canvasParent = document.getElementById(this.canvasBoxId);
    this.canvas = document.getElementById(this.canvasId);
    this.canvas.width = canvasParent.offsetWidth;
    this.canvas.height = canvasParent.offsetHeight;
    console.log(this.canvas, canvasParent);
    this.redrawCanvas();
  }

  generateRandomString() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  NP = {row: 0, column: 0};
  autoInit() {
    this.boxInfo = [
      {id: '1', level: 0, text: 'L1-0', childrenIds: ['1-1', '1-2', '1-3']},
      {id: '1-1', level: 1, text: 'L1-1', childrenIds: []},
      {id: '1-2', level: 1, text: 'L1-2', childrenIds: ['1-2-1', '1-2-2', '1-2-3']},
      {id: '1-3', level: 1, text: 'L1-3', childrenIds: ['1-3-1', '1-3-2']},
      {id: '1-2-1', level: 2, text: 'L1-2-1', childrenIds: []},
      {id: '1-2-2', level: 2, text: 'L1-2-2', childrenIds: []},
      {id: '1-2-3', level: 2, text: 'L1-2-3', childrenIds: []},
      {id: '1-3-1', level: 2, text: 'L1-3-1', childrenIds: []},
      {id: '1-3-2', level: 2, text: 'L1-3-2', childrenIds: []},
    ];
    // this.boxInfo.forEach(x => {
    //   this.createBoxes(x);
    // });
    this.setPos();
  }

  setPos() {
    const levelList = Array.from(new Set(this.boxInfo.map(x => x.level)));
    console.log('levels', levelList);
    levelList.forEach(level => {
      this.NP.row = level + 1;
      this.NP.column = 1;

      const boxes = this.boxInfo.filter(x => x.level === level);
      let pn: any;
      let firstChild = true;
      boxes.forEach(box => {
        if (pn && pn.childrenIds && pn.childrenIds.length) {
          this.NP.column = pn.NP.column + pn.childrenIds.length;
        }

        const cb = this.boxInfo.filter(x => box.childrenIds.includes(x.id));
        // console.log('ccbb', box, '\ncb:', cb[0], '\nnp:', this.NP);
        if (firstChild) {
          firstChild = false;
          const parent: any = this.boxInfo.filter(x => x.childrenIds.includes(box.id));
          if (parent && parent.length) {
            console.log('parent -', parent[0]);
            // this.NP.column = parent[0].NP.column;
          }
        }
        box.x = this.NP.column * this.boxSize.width;
        box.y = this.NP.row * this.boxSize.height;
        box.NP = JSON.parse(JSON.stringify(this.NP));
        this.NP.column ++;
        pn = box; // previous box
        // console.log('bb->', box);
      });
      console.log('box/level', boxes);
    });
   console.log('box info', this.boxInfo);
   return;
    this.boxInfo.forEach(item => {
      if (item.level === 0) {
        this.NP = {
          row: 1,
          column: 1
        };
      } else {

      }
      item.x = this.NP.row * this.boxSize.width;
      item.y = this.NP.column * this.boxSize.height;

    });
  }

  createBoxes(rec: any) {
    rec.children = [];
    // rec.children.include()
    rec.childrenIds.forEach(item => {
      this.boxInfo.forEach(y => {
        if (item === y.id) {
          rec.children.push(y);
        }
      });

    });
    console.log(this.boxInfo);
  }















  initiateData() {
    this.boxInfo = [{"id":0,"footerText":"header","text":"header","icon":"flag","color":"#400040","x":550,"y":60},
      {"id":2,"footerText":"one","text":"one","icon":"flag","color":"green","x":216,"y":173},
      {"id":3,"footerText":"two","text":"two","icon":"flag","color":"green","x":550,"y":180},
      {"id":4,"footerText":"Three","text":"Three","icon":"flag","color":"green","x":850,"y":177},
      {"id":5,"footerText":"Four","text":"Four","icon":"flag","color":"green","x":850,"y":20},
      {"id":5,"footerText":"five","text":"five","icon":"flag","color":"green","x":450,"y":300},
      {"id":5,"footerText":"six","text":"six","icon":"flag","color":"green","x":300,"y":300},
      {"id":5,"footerText":"seven","text":"seven","icon":"flag","color":"green","x":700,"y":250},
      ];
    this.lineInfo = [{"type":"break","fromX":621,"fromY":125,"toX":621,"toY":222,"from":{"id":0,"footerText":"header","text":"header","icon":"flag","color":"#400040","x":73,"y":80}, "to":"","id":4},
      {"type":"break","fromX":621,"fromY":222,"toX":686,"toY":222,"from":{"id":0,"footerText":"header","text":"header","icon":"flag","color":"#400040","x":73,"y":80},
      "to":{"id":4,"footerText":"Three","text":"Three","icon":"flag","color":"green","x":684,"y":177},"id":5},
      {"type":"break","fromX":650,"fromY":130,"toX":650,"toY":165,"from":{"id":0,"footerText":"header","text":"header","icon":"flag","color":"#400040","x":73,"y":80},
        "to":"","id":6},{"type":"break","fromX":650,"fromY":165,"toX":932,"toY":164,"from":{"id":0,"footerText":"header","text":"header","icon":"flag","color":"#400040","x":73,"y":80},
        "to":"","id":7},{"type":"break","fromX":932,"fromY":164,"toX":932,"toY":181,"from":{"id":0,"footerText":"header","text":"header","icon":"flag","color":"#400040","x":73,"y":80},
        "to":{"id":5,"footerText":"Four","text":"Four","icon":"flag","color":"green","x":866,"y":180},"id":8},{"type":"break","fromX":597,"fromY":126,"toX":599,"toY":226,
        "from":{"id":0,"footerText":"header","text":"header","icon":"flag","color":"#400040","x":73,"y":80},"to":"","id":9},{"type":"break","fromX":599,"fromY":226,"toX":530,"toY":226,
        "from":{"id":0,"footerText":"header","text":"header","icon":"flag","color":"#400040","x":73,"y":80},"to":{"id":3,"footerText":"two","text":"two","icon":"flag","color":"green","x":413,"y":180},
        "id":10},{"type":"break","fromX":577,"fromY":132,"toX":577,"toY":166,"from":{"id":0,"footerText":"header","text":"header","icon":"flag","color":"#400040","x":73,"y":80},
        "to":"","id":11},{"type":"break","fromX":577,"fromY":166,"toX":283,"toY":164,"from":{"id":0,"footerText":"header","text":"header","icon":"flag","color":"#400040","x":73,"y":80},
        "to":"","id":12},{"type":"break","fromX":283,"fromY":164,"toX":283,"toY":175,"from":{"id":0,"footerText":"header","text":"header","icon":"flag","color":"#400040","x":73,"y":80},
        "to":{"id":2,"footerText":"one","text":"one","icon":"flag","color":"green","x":216,"y":173},"id":13}];
    this.connections = [
      {
        type: '',
        from: 'header',
        to: 'one'
      }, {
        type: 'autoBreak',
        from: 'one',
        to: 'five'
      }, {
        type: 'autoBreak',
        from: 'header',
        to: 'two'
      }, {
        type: 'autoBreak',
        from: 'header',
        to: 'Three'
      }, {
        type: 'autoBreak',
        from: 'header',
        to: 'Four'
      }, {
        type: 'autoBreak',
        from: 'two',
        to: 'five'
      }, {
        type: 'autoBreak',
        from: 'five',
        to: 'seven'
      }, {
        type: 'autoBreak',
        from: 'six',
        to: 'five'
      }
    ];
    this.setIdToBox();
    this.calcLinePoint();
    console.log('line', this.boxInfo, this.lineInfo);
    this.exportLineData();
  }

  setIdToBox() {
    this.boxInfo.map((x, index) => x.id = index);
  }

  generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  calcLinePoint(state?) {
    this.lineInfo = [];
    const field = 'text'; // can be name later when we added name field to boxInfo
    this.connections.forEach(item => {
      const fromBox = this.boxInfo.filter(y => y[field].toLowerCase() === item.from.toLowerCase());
      const toBox = this.boxInfo.filter(y => y[field].toLowerCase() === item.to.toLowerCase());
      console.log('toBox', toBox);
      if (state)
        debugger
      if (fromBox && fromBox.length) {
        const point = this.calcPointOfCenterBox(fromBox[0]);
        item.fromX = point.x;
        item.fromY = point.y;
      }
      if (toBox && toBox.length) {
        const point = this.calcPointOfCenterBox(toBox[0]);
        item.toX = point.x;
        item.toY = point.y;
      }
      if (item.type === 'autoBreak') {
        this.autoBreakLine(item);
      } else {
        item.id = this.generateId();
        this.lineInfo.push(item);
      }
    });
    console.log('itemmmmmm', this.boxInfo, this.lineInfo);
  }

  calcPointOfCenterBox(box) {
    return {
      x: box.x + (this.boxSize.width / 2),
      y: box.y + (this.boxSize.height / 2),
    };
  }

  autoBreakLine(item) {
    item.id = this.generateId();
    const height = this.boxSize.height + 10; // item.toY > item.fromY ? item.toY - item.fromY : this.boxSize.height + 10;
    const width = Math.abs(item.toX - item.fromX);
    if (Math.abs(item.toX - item.fromX) < 30 || Math.abs(item.toY - item.fromY) < 30) {
      this.lineInfo.push(item);
    } else {
      const pos: any = JSON.parse(JSON.stringify(item));
      pos.toY = item.fromY + height / 2;
      pos.toX = item.fromX;
      this.lineInfo.push(pos);

      /* horizontal Line pos */
      const pos1: any = JSON.parse(JSON.stringify(item));
      pos1.toX = item.fromX > item.toX ? item.fromX - width : item.fromX + width;
      pos1.toY = item.fromY + height / 2;
      pos1.fromY = item.fromY + height / 2;
      this.lineInfo.push(pos1);

      /* Vertical Line pos */
      const pos2: any = JSON.parse(JSON.stringify(item));
      pos2.fromX = item.fromX > item.toX ? item.fromX - width : item.fromX + width;
      pos2.fromY = pos1.fromY;
      this.lineInfo.push(pos2);
    }
  }

  exportData() {
    console.log('export data -> ', JSON.stringify(this.boxInfo), JSON.stringify(this.lineInfo));
    this.chartResult.emit({box: this.boxInfo, line: this.lineInfo});
  }

  exportLineData() {
    console.log(this.lineInfo);
    this.lineData = this.lineInfo.filter((item, index, self) =>
      index === self.findIndex((t) => (
        t.from === item.from && t.to === item.to
      ))
    );
    console.log(this.lineData);
  }

  changeColor(event) {
    console.log('color', event.target.value);
    this.lineColor = event.target.value;
  }

  showInsertModal(event) {
    if (this.state === 'preview') {
      return;
    }
    if (this.isEdit) {
      return;
    }
    console.log('dbl', event);
    this.showModal = true;
    this.newItem.x = event.clientX;
    this.newItem.y = event.clientY;
  }

  setArrow() {
    return [
      [ this.lineWidth * 3, 0 ],
      [ -10, -this.lineWidth * 2 ],
      [ -10, this.lineWidth * 2]
    ];
  }

  closeModal() {
    this.errorText = '';
    this.newItem = {
      id: ++ this.boxId,
      footerText: '',
      text: '',
      icon: 'flag',
      color: 'green',
      x: 50,
      y: 50,
    };
    this.showModal = false;
  }

  insertItem() {
    console.log('new itoemmmm', this.newItem)
    if (this.newItem.text.trim().length === 0 || this.newItem.footerText.trim().length === 0) {
      this.errorText = 'Please fill the Title and Footer Text fields';
      return;
    }
    if (!this.isEdit) {
      this.newItem.color = this.newItem.color || 'green';
      this.newItem.icon = this.newItem.icon || 'flag';
      this.newItem.x = this.newItem.x || 50;
      this.newItem.y = this.newItem.y || 50;
      this.boxInfo.push(this.newItem);
    }
    this.isEdit = false;
    this.closeModal();
  }

  settime: any;
  boxMoving(item, event) {

    /* could be this.lineInfo.forEach but for performance better use this.lineData */
    this.lineData.forEach(x => {
      if (item.text === x.from || item.text === x.to) {
        this.removeLine(x);
      }
    });
    clearTimeout(this.settime);
    item.x = event.pointerPosition.x;
    item.y = event.pointerPosition.y;
    this.settime = setTimeout(() => {
      console.log('moving box', item, event);
      console.log('oneeee');

      this.calcLinePoint(true);
    }, 1500);
    // this.lineInfo = this.lineInfo.filter(x => x.to.id !== item.id && x.from.id !== item.id);
    // this.redrawCanvas(true);
  }

  pushData(event, toX, toY, item) {
    this.lineInfo.push({
      type: this.breakLine ? 'break' : 'direct', // TODO need to change and adapt with new method
      fromX: this.mouseX,
      fromY: this.mouseY,
      toX,
      toY,
      from: this.source,
      to: item,
      id: this.lineId ++
    });
  }

  redrawCanvas(clear = false) {
    if (clear) {
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.lineInfo.forEach(x => {
      this.draw(x);
    });
  }

  mouseDown(event, item, from) {
    if (this.state === 'preview') {
      return;
    }
    console.log(event)
    if (this.breakLine && this.source) {
      return;
    }
    // console.log('down', item, event.clientX, 'y', event.clientY, event);
    // if (from === 'right') {
    //   this.mouseX = event.clientX + (20 - event.offsetX);
    // } else {
    this.mouseX = event.clientX;
    // }
    this.mouseY = event.clientY;
    this.source = item;
    console.log('mousedown', this.mouseX, 'y', this.mouseY);
    this.isDraw = true;
  }

  mouseUp(event, item, from) {
    if (this.state === 'preview') {
      return;
    }
    console.log('in uppp', this.isDraw, this.source, item);
    if (this.isDraw) {
      // console.log('cx', event.clientX, 'cy', event.clientY, '\n ox', event.offsetX, 'oy', event.offsetY);
      if (this.source.id === item.id) {
        return;
      }
      let toX = event.clientX;
      let toY = event.clientY;
      if (from === 'left') {
        toX = event.clientX - event.offsetX;
      }
      if (from === 'right') {
        toX = event.clientX + (20 - event.offsetX);
      }
      if (from === 'up') {
        toY = event.clientY - event.offsetY;
      }
      if (from === 'down') {
        toY = event.clientY + (20 - event.offsetY);
      }
      this.pushData(event, toX, toY, item);
      // console.log('ctx --->', this.lineInfo);
      this.redrawCanvas(false);
    }
    this.source = null;
    this.isDraw = false;
  }

  mouseMove(event) {
    if (this.state === 'preview') {
      return;
    }
    if (this.isDraw) {
      // const canvas: any = document.getElementById('canvas1');
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.beginPath();
      ctx.moveTo(this.mouseX, this.mouseY);
      ctx.lineTo(event.clientX, event.clientY);
      ctx.strokeStyle = this.lineColor;
      ctx.lineWidth = this.lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
      const ang = Math.atan2(event.clientY - this.mouseY, event.clientX - this.mouseX);
      this.drawFilledPolygon(ctx, this.translateShape(this.rotateShape(this.setArrow(), ang), event.clientX, event.clientY));
      this.redrawCanvas(false);
    }
  }

  mouseUpPage(event) {
    if (this.state === 'preview') {
      return;
    }
    console.log('page uppppppp', event, this.isDraw, this.source);
    if (this.breakLine && this.isDraw) {
      const toX = event.clientX;
      const toY = event.clientY;
      this.pushData(event, toX, toY, '');
      this.redrawCanvas(false);
      this.mouseX = toX;
      this.mouseY = toY;
    } else {
      this.redrawCanvas(true);
      this.isDraw = false;
    }
  }

  draw(item) {
    const ctx = this.canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(item.fromX, item.fromY);
    ctx.lineTo(item.toX, item.toY);
    ctx.strokeStyle = this.lineColor;
    ctx.lineWidth = this.lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
    const ang = Math.atan2(item.toY - item.fromY, item.toX - item.fromX);
    if (item.type === 'direct') {
      this.drawFilledPolygon(ctx, this.translateShape(this.rotateShape(this.setArrow(), ang), item.toX, item.toY));
    }
  }

  removeBox(item) {
    this.boxInfo = this.boxInfo.filter(x => x.id !== item.id);
    this.lineInfo = this.lineInfo.filter(x => x.to.id !== item.id && x.from.id !== item.id);
    console.log('rmbox', this.lineInfo);
    this.redrawCanvas(true);
  }

  removeLine(item) {
    this.lineInfo = this.lineInfo.filter(x => x.id !== item.id);
    this.lineData = this.lineData.filter(x => x.id !== item.id);
    this.redrawCanvas(true);
  }

  editChartBox(item) {
    console.log('edit', item);
    this.newItem = item;
    this.isEdit = true;
    this.showModal = true;
  }

  drawFilledPolygon(ctx, shape) {
    ctx.beginPath();
    ctx.moveTo(shape[0][0], shape[0][1]);

    for (const p in shape)
      if (Number(p) > 0) {
        ctx.lineTo(shape[p][0], shape[p][1]);
      }

    ctx.lineTo(shape[0][0], shape[0][1]);
    ctx.fill();
  }

  translateShape(shape, x, y) {
    const rv = [];
    for (const p in shape)
      rv.push([ shape[p][0] + x, shape[p][1] + y ]);
    return rv;
  }

  rotateShape(shape, ang) {
    const rv = [];
    for (const p in shape)
      rv.push(this.rotatePoint(ang, shape[p][0], shape[p][1]));
    return rv;
  }

  rotatePoint(ang, x, y) {
    return [
      (x * Math.cos(ang)) - (y * Math.sin(ang)),
      (x * Math.sin(ang)) + (y * Math.cos(ang))
    ];
  }
}
