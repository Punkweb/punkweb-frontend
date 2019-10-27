export class FractalRenderer {

  constructor(public ctx: any) { }

  private getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  private horizontalLine(x: number, y: number, len: number) {
    if (len < 10) {
      return;
    }

    let f = Math.sqrt(2);

    this.ctx.beginPath();
    this.ctx.moveTo(x - len / 2, y);
    this.ctx.lineTo(x + len / 2, y);
    this.ctx.strokeStyle = 'white';
    this.ctx.stroke();

    // For each horizontal, draw two vertical lines on the sides
    this.verticalLine(x - len / 2, y, len / f);
    this.verticalLine(x + len / 2, y, len / f);
  }

  private verticalLine(x: number, y: number, len: number) {
    if (len < 10) {
      return;
    }

    let f = Math.sqrt(2);

    this.ctx.beginPath();
    this.ctx.moveTo(x, y - len / 2);
    this.ctx.lineTo(x, y + len / 2);
    this.ctx.stroke();

    // For each vertical, draw two horizontal lines on the sides
    this.horizontalLine(x, y - len / 2, len / f);
    this.horizontalLine(x, y + len / 2, len / f);
  }

  public lines(x: number, y: number, len: number) {
    this.verticalLine(x, y, len);
  }

  private circle1(x: number, y: number, radius: number) {
    if (radius < 20) {
      return;
    }
    let circum = 2 * Math.PI;
    let f = Math.sqrt(2);

    this.ctx.beginPath();
    this.ctx.fillStyle = this.getRandomColor();
    this.ctx.moveTo(x, y - radius / 2);
    this.ctx.arc(x, y, radius, 0, circum);
    this.ctx.fill();

    this.circle2(x - radius / 2, y, radius / f);
    this.circle2(x + radius / 2, y, radius / f);
  }

  private circle2(x: number, y: number, radius: number) {
    if (radius < 20) {
      return;
    }
    let circum = 2 * Math.PI;
    let f = Math.sqrt(2);

    this.ctx.beginPath();
    this.ctx.fillStyle = this.getRandomColor();
    this.ctx.moveTo(x, y - radius / 2);
    this.ctx.arc(x, y, radius, 0, circum);
    this.ctx.fill();

    this.circle1(x, y - radius / 2, radius / f);
    this.circle1(x, y + radius / 2, radius / f);
  }

  public circles(x: number, y: number, radius: number) {
    this.circle2(x, y, radius);
  }

  private triangle1(x: number, y: number, len: number) {
    if (len < 20) {
      return;
    }
    let f = Math.sqrt(2);

    this.ctx.beginPath();
    this.ctx.fillStyle = this.getRandomColor();
    this.ctx.moveTo(x - len / 2, y);
    this.ctx.lineTo(x + len / 2, y + len);
    this.ctx.lineTo(x - len / 2, y + len);
    this.ctx.closePath();
    this.ctx.fill();

    this.triangle2(x - len / 2, y, len / f);
    this.triangle2(x + len / 2, y, len / f);
  }

  private triangle2(x: number, y: number, len: number) {
    if (len < 20) {
      return;
    }
    let f = Math.sqrt(2);

    this.ctx.beginPath();
    this.ctx.fillStyle = this.getRandomColor();
    this.ctx.moveTo(x, y - len / 2);
    this.ctx.lineTo(x + len, y / 2 + len);
    this.ctx.lineTo(x - len, y / 2 + len);
    this.ctx.closePath();
    this.ctx.fill();

    this.triangle1(x, y - len / 2, len / f);
    this.triangle1(x, y + len / 2, len / f);
  }

  public triangles(x: number, y: number, len: number) {
    this.triangle1(x, y, len);
  }

}
