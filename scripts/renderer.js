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

        this.transX = 5;
        this.transY = 2;

        this.angle = [0, 0, 0];
        this.spin_matrix_trans = [];
        this.spin_matrix_angel = [];
        let spin_matrix = [];
        this.s1_colors = []

        //slide 0 model
        let a = 0;
        let sides = 360 / 40;
        let center = {x: 300, y: 300};
        let x;
        let y;
        let circle_points = [];

        for(let i = 0; i <= 40; i++) {
            x = parseInt(center.x + 100 * Math.cos(a * Math.PI / 180));
            y = parseInt(center.y + 100 * Math.sin(a * Math.PI / 180));
            circle_points[i] = CG.Vector3(x, y, 1);
            a += sides;
        }

        let bounce_matrix = new Matrix(3, 3);
        bounce_matrix = CG.mat3x3Translate(bounce_matrix, 2, 1);


        //slide 1 models
        for (let i = 0; i < 3; i++) {
            this.s1_colors[i] = [Math.floor(Math.random() * 225), Math.floor(Math.random() * 225), Math.floor(Math.random() * 225), 255];
        }
        //model 1
        this.spin_matrix_trans[0] = new Matrix(3, 3);
        this.spin_matrix_trans[0] = CG.mat3x3Translate(this.spin_matrix_trans[0], 150, 300);

        this.spin_matrix_angel[0] = new Matrix(3, 3);
        this.spin_matrix_angel[0] = CG.mat3x3Rotate(this.spin_matrix_angel[0], this.angle[0] * Math.PI /180);

        spin_matrix[0] = this.spin_matrix_trans[0].mult(this.spin_matrix_angel[0]);

        //model 2
        sides = 360 / 5;
        center = {x: 0, y: 0};
        let s1_shape2_points = [];
        for(let i = 0; i <= 5; i++) {
            x = parseInt(center.x + 50 * Math.cos(a * Math.PI / 180));
            y = parseInt(center.y + 50 * Math.sin(a * Math.PI / 180));
            s1_shape2_points[i] = CG.Vector3(x, y, 1);
            a += sides;
        }

        this.spin_matrix_trans[1] = new Matrix(3, 3);
        this.spin_matrix_trans[1] = CG.mat3x3Translate(this.spin_matrix_trans[1], 400, 100);

        this.spin_matrix_angel[1] = new Matrix(3, 3);
        this.spin_matrix_angel[1] = CG.mat3x3Rotate(this.spin_matrix_angel[1], this.angle[1] * Math.PI /180);

        spin_matrix[1] = this.spin_matrix_trans[1].mult(this.spin_matrix_angel[1]);


        //model 3

        sides = 360 / 10;

        let s1_shape3_points = [];
        for(let i = 0; i <= 5; i++) {
            x = parseInt(center.x + 150 * Math.cos(a * Math.PI / 180));
            y = parseInt(center.y + 150 * Math.sin(a * Math.PI / 180));
            s1_shape3_points.push(CG.Vector3(x, y, 1));

            a += sides;

            x = parseInt(center.x + 80 * Math.cos(a * Math.PI / 180));
            y = parseInt(center.y + 80 * Math.sin(a * Math.PI / 180));
            s1_shape3_points.push(CG.Vector3(x, y, 1));

            a += sides;
        }

        this.spin_matrix_trans[2] = new Matrix(3, 3);
        this.spin_matrix_trans[2] = CG.mat3x3Translate(this.spin_matrix_trans[2], 600, 300);

        this.spin_matrix_angel[2] = new Matrix(3, 3);
        this.spin_matrix_angel[2] = CG.mat3x3Rotate(this.spin_matrix_angel[2], this.angle[2] * Math.PI /180);

        spin_matrix[2] = this.spin_matrix_trans[2].mult(this.spin_matrix_angel[2]);

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
            slide1: [
                {
                    shapes: [[
                        CG.Vector3(100, 100, 1),
                        CG.Vector3(-100, 100, 1),
                        CG.Vector3(-100, -100, 1),
                        CG.Vector3(100, -100, 1)
                    ], s1_shape2_points, s1_shape3_points],
                    //shape2: s1_shape2_points,
                    transform: [spin_matrix[0], spin_matrix[1], spin_matrix[2]],
                    //transform2: spin_matrix[1]
                }
            ],
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
        switch (this.slide_idx) {
            case 0:
                this.models.slide0[0].transform.values[0][2] += this.transX;
                this.models.slide0[0].transform.values[1][2] += this.transY;      
                break;
            case 1:
                this.angle[0] += 0.1;
                this.angle[1] += 0.01;
                this.angle[2] -= 0.05;

                for (let i = 0; i < 3; i++) {
                    this.spin_matrix_angel[i] = CG.mat3x3Rotate(this.spin_matrix_angel[i], this.angle[i]);
                    this.models.slide1[0].transform[i] = this.spin_matrix_trans[i].mult(this.spin_matrix_angel[i]);
                }
                break;
            case 2:
                
                break;
            case 3:
                
                break;
        }
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

        let points = [];
        let transform = this.models.slide0[0].transform;
        //console.log(this.models.slide0[0].vertices[0]);

        for (let i = 0; i < this.models.slide0[0].vertices.length; i++) {
            let v = transform.mult(this.models.slide0[0].vertices[i]);
            //console.log(v.values[0]);
            if (v.values[0] > this.canvas.width - 200 || v.values[0] < 0) {
                this.transX *= -1;
            }
            if (v.values[1] > this.canvas.height || v.values[1] < 0) {
                this.transY *= -1;
            }

            points[i] = v;
        }

        let teal = [0, 128, 128, 255];
        this.drawConvexPolygon(points, teal);
        //onsole.log(points[0].values[0][0]);
    
    }

    //
    drawSlide1() {
        // TODO: draw at least 3 polygons that spin about their own centers
        //   - have each polygon spin at a different speed / direction

        for (let i = 0; i < 3; i++) {
            let points = [];
            
            for (let j = 0; j < this.models.slide1[0].shapes[i].length; j++) {
                let v = this.models.slide1[0].transform[i].mult(this.models.slide1[0].shapes[i][j]);
                points[j] = v;
            }
            this.drawConvexPolygon(points, this.s1_colors[i]);
        }      
        
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
