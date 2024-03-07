import * as CG from './transforms.js';
import { Matrix } from "./matrix.js";

class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // limit_fps_flag:      bool 
    // fps:                 int
    constructor(canvas, limit_fps_flag, fps) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.limit_fps = limit_fps_flag;
        this.fps = fps;
        this.start_time = null;
        this.prev_time = null;

        let a = 0;
        let angle = 360 / 40;
        let center = {x: 300, y: 300};
        let x;
        let y;
        let circle_points = [];

        for(let i = 0; i <= 40; i++) {
            x = parseInt(center.x + 100 * Math.cos(a * Math.PI / 180));
            y = parseInt(center.y + 100 * Math.sin(a * Math.PI / 180));
            circle_points[i] = CG.Vector3(x, y, 1);
            a += angle;
        }

        let bounce_matrix = new Matrix(3, 3);
       bounce_matrix = CG.mat3x3Translate(bounce_matrix, 5, 2);


        this.models = {
            slide0: [
                // example model (diamond) -> should be replaced with actual model
                {
                    // vertices: [
                    //     CG.Vector3(400, 150, 1),
                    //     CG.Vector3(500, 300, 1),
                    //     CG.Vector3(400, 450, 1),
                    //     CG.Vector3(300, 300, 1)
                    // ],
                    // transform: null

                    vertices: circle_points,
                    transform: bounce_matrix
                }
            ],
            slide1: [],
            slide2: [],
            slide3: []
        };
    }

    // flag:  bool
    limitFps(flag) {
        this.limit_fps = flag;
    }

    // n:  int
    setFps(n) {
        this.fps = n;
    }

    // idx: int
    setSlideIndex(idx) {
        this.slide_idx = idx;
    }

    animate(timestamp) {
        // Get time and delta time for animation
        if (this.start_time === null) {
            this.start_time = timestamp;
            this.prev_time = timestamp;
        }
        let time = timestamp - this.start_time;
        let delta_time = timestamp - this.prev_time;
        //console.log('animate(): t = ' + time.toFixed(1) + ', dt = ' + delta_time.toFixed(1));

        // Update transforms for animation
        this.updateTransforms(time, delta_time);

        // Draw slide
        this.drawSlide();

        // Invoke call for next frame in animation
        if (this.limit_fps) {
            setTimeout(() => {
                window.requestAnimationFrame((ts) => {
                    this.animate(ts);
                });
            }, Math.floor(1000.0 / this.fps));
        }
        else {
            window.requestAnimationFrame((ts) => {
                this.animate(ts);
            });
        }

        // Update previous time to current one for next calculation of delta time
        this.prev_time = timestamp;
    }

    //
    updateTransforms(time, delta_time) {
        // TODO: update any transformations needed for animation
    }
    
    //
    drawSlide() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0();
                break;
            case 1:
                this.drawSlide1();
                break;
            case 2:
                this.drawSlide2();
                break;
            case 3:
                this.drawSlide3();
                break;
        }
    }

    //
    drawSlide0() {
        // TODO: draw bouncing ball (circle that changes direction whenever it hits an edge)
        
        for (let i = 0; i < this.models.slide0[0].vertices.length; i++) {
            if (this.models.slide0[0].vertices[i].values[0] > this.canvas.width || this.models.slide0[0].vertices[i].values[0] < 0) {
                this.models.slide0[0].transform.values[0][2] = this.models.slide0[0].transform.values[0][2] * -1;
                break;
            }
            if (this.models.slide0[0].vertices[i].values[1] > this.canvas.height || this.models.slide0[0].vertices[i].values[1] < 0) {
                this.models.slide0[0].transform.values[1][2] = this.models.slide0[0].transform.values[1][2] * -1;
                break;
            }
        }
        
        let teal = [0, 128, 128, 255];
        this.drawConvexPolygon(this.models.slide0[0].vertices, teal);

        for (let i = 0; i < this.models.slide0[0].vertices.length; i++) {
            this.models.slide0[0].vertices[i] = this.models.slide0[0].transform.mult(this.models.slide0[0].vertices[i]);
        }
       
        //console.log(this.models.slide0[0].transform.values[0][2]);
    
    }

    //
    drawSlide1() {
        // TODO: draw at least 3 polygons that spin about their own centers
        //   - have each polygon spin at a different speed / direction
        
        
    }

    //
    drawSlide2() {
        // TODO: draw at least 2 polygons grow and shrink about their own centers
        //   - have each polygon grow / shrink different sizes
        //   - try at least 1 polygon that grows / shrinks non-uniformly in the x and y directions


    }

    //
    drawSlide3() {
        // TODO: get creative!
        //   - animation should involve all three basic transformation types
        //     (translation, scaling, and rotation)
        
        
    }
    
    // vertex_list:  array of object [Matrix(3, 1), Matrix(3, 1), ..., Matrix(3, 1)]
    // color:        array of int [R, G, B, A]
    drawConvexPolygon(vertex_list, color) {
        this.ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3] / 255) + ')';
        this.ctx.beginPath();
        let x = vertex_list[0].values[0][0] / vertex_list[0].values[2][0];
        let y = vertex_list[0].values[1][0] / vertex_list[0].values[2][0];
        this.ctx.moveTo(x, y);
        for (let i = 1; i < vertex_list.length; i++) {
            x = vertex_list[i].values[0][0] / vertex_list[i].values[2][0];
            y = vertex_list[i].values[1][0] / vertex_list[i].values[2][0];
            this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
};

export { Renderer };
