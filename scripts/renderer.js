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

        //slide 0
        this.transX = (Math.random() * 15) - 5;
        this.transY = (Math.random() * 15) - 5;
        // this.transX = 5;
        // this.transY = 2;

        this.angle = [0, 0, 0];
        this.spin_matrix_trans = [];
        this.spin_matrix_angel = [];
        let spin_matrix = [];
        this.s1_colors = [];

        this.angle1 = [0];
        this.spin_matrix_trans1 = [];
        this.spin_matrix_angel1 = [];
        let spin_matrix2 = [];


        this.grow = [1.1];
        this.s_offset = [-0.01]; //;
        this.shrink = [0.9];
        this.scale_matrix_trans = [];
        this.scale_matrix_angel = [];
        let scale_matrix = [];

        this.grow5 = [1.1];
        this.s_offset5 = [-0.02]; //;
        this.shrink5 = [0.9];
        this.scale_matrix_trans5 = [];
        this.scale_matrix_angel5 = [];
        let scale_matrix5 = [];
        
        this.grow9 = [1.1];
        this.s_offset9 = [-0.02]; //;
        this.shrink9 = [0.3];
        this.scale_matrix_trans9 = [];
        this.scale_matrix_angel9 = [];
        let scale_matrix9 = [];


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

        //slide 2 models (SCALE)
        this.scale_matrix_trans[0] = new Matrix(3, 3);
        this.scale_matrix_trans[0] = CG.mat3x3Translate(this.scale_matrix_trans[0], 250, 400);

        this.scale_matrix_angel[0] = new Matrix(3, 3);
        this.scale_matrix_angel[0] = CG.mat3x3Scale(this.scale_matrix_angel[0], this.grow[0], this.shrink[0]);
        
        scale_matrix[0] = this.scale_matrix_trans[0].mult(this.scale_matrix_angel[0]);


        this.scale_matrix_trans5[0] = new Matrix(3, 3);
        this.scale_matrix_trans5[0] = CG.mat3x3Translate(this.scale_matrix_trans5[0], 250, 300);

        this.scale_matrix_angel5[0] = new Matrix(3, 3);
        this.scale_matrix_angel5[0] = CG.mat3x3Scale(this.scale_matrix_angel5[0], this.shrink5[0], this.shrink5[0]);
        
        scale_matrix5[0] = this.scale_matrix_trans5[0].mult(this.scale_matrix_angel5[0]);


        //slide 1 models
        for (let i = 0; i < 3; i++) {
            this.s1_colors[i] = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 255];
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

        let bounce_matrix4 = new Matrix(3, 3);
        bounce_matrix4 = CG.mat3x3Translate(bounce_matrix4, 2, 0);

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


        //slide 3
        //model 1
        this.trans4X = 5;
        this.trans4Y = 0;
        let a4 = 0;
        let sides4 = 360 / 40;
        let center4 = {x: 300, y: 500};
        let x4;
        let y4;
        let circle_points4 = [];
        this.spin_matrix_trans4 = [];
        this.spin_matrix_angel4 = [];

        for(let i = 0; i <= 50; i++) {
            x4 = parseInt(center4.x + 100 * Math.cos(a4 * Math.PI / 180));
            y4 = parseInt(center4.y + 100 * Math.sin(a4 * Math.PI / 180));
            circle_points4[i] = CG.Vector3(x4, y4, 1);
            
            a4 += sides4;
        }

        sides4 = 360 / 50;
        center4 = {x: 400, y: 300};
        for(let i = 0; i <= 30; i++) {
            x4 = parseInt(center4.x + 100 * Math.cos(a4 * Math.PI / 180));
            y4 = parseInt(center4.y + 100 * Math.sin(a4 * Math.PI / 180));
            circle_points4[i] = CG.Vector3(x4, y4, 1);
            
            a4 += sides4;
        }
        // model 2
        this.spin_matrix_trans1[0] = new Matrix(3, 3);
        this.spin_matrix_trans1[0] = CG.mat3x3Translate(this.spin_matrix_trans1[0], 650, 400);

        this.spin_matrix_angel1[0] = new Matrix(3, 3);
        this.spin_matrix_angel1[0] = CG.mat3x3Rotate(this.spin_matrix_angel1[0], this.angle1[0] * Math.PI /180);

        spin_matrix2[0] = this.spin_matrix_trans1[0].mult(this.spin_matrix_angel1[0]);

        //model 3
        this.scale_matrix_trans9[0] = new Matrix(3, 3);
        this.scale_matrix_trans9[0] = CG.mat3x3Translate(this.scale_matrix_trans9[0], 90, 350);

        this.scale_matrix_angel9[0] = new Matrix(3, 3);
        this.scale_matrix_angel9[0] = CG.mat3x3Scale(this.scale_matrix_angel9[0], this.shrink9[0], this.shrink9[0]);
        
        scale_matrix9[0] = this.scale_matrix_trans9[0].mult(this.scale_matrix_angel9[0]);


        this.models = {
            slide0: [
                {
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
            slide2: [
                {
                    shapes: [[
                        CG.Vector3(100, 100, 1),
                        CG.Vector3(-100, 100, 1),
                        CG.Vector3(-100, -100, 1),
                        CG.Vector3(100, -100, 1)
                    ]],
                
                    transform: [scale_matrix[0]],

                    shapes5: [[
                        CG.Vector3(100, 100, 1),
                        CG.Vector3(-100, 100, 1),
                        CG.Vector3(-100, -100, 1),
                        CG.Vector3(100, -100, 1)
                    ]],
            
                    transform5: [scale_matrix5[0]],
                }
            ],
            slide3: [
            {
                vertices: circle_points4,
                transform: bounce_matrix4, 
                
                shapes: [[
                    CG.Vector3(70, 70, 1),
                    CG.Vector3(-70, 70, 1),
                    CG.Vector3(-70, -70, 1),
                    CG.Vector3(70, -70, 1)
                ]],
                //shape2: s1_shape2_points,
                transform2: [spin_matrix2[0]],
                //transform2: spin_matrix[1]

                shapes9: [[
                    CG.Vector3(10, 100, 1),
                    CG.Vector3(-100, 100, 1),
                    CG.Vector3(-100, -200, 1),
                    CG.Vector3(100, -100, 1)
                ]],
            
                transform9: [scale_matrix9[0]],
            }
                
            ]
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
                this.shrink[0] += this.s_offset[0];
                this.grow[0] += this.s_offset[0];

                for (let i = 0; i < 1; i++) {
                    this.scale_matrix_angel[i] = CG.mat3x3Scale(this.scale_matrix_angel[i], this.grow[i], this.shrink[i]);
                    this.models.slide2[0].transform[i] = this.scale_matrix_trans[i].mult(this.scale_matrix_angel[i]);
                }

                this.shrink5[0] += this.s_offset5[0];

                for (let i = 0; i < 1; i++) {
                    this.scale_matrix_angel5[i] = CG.mat3x3Scale(this.scale_matrix_angel5[i], this.shrink5[i], this.shrink5[i]);
                    this.models.slide2[0].transform5[i] = this.scale_matrix_trans5[i].mult(this.scale_matrix_angel5[i]);
                }

                break;
            case 3:
                this.models.slide3[0].transform.values[0][2] += this.trans4X;
                this.models.slide3[0].transform.values[1][2] += this.trans4Y;  
                
                this.angle1[0] += 0.4;

                for (let i = 0; i < 1; i++) {
                    this.spin_matrix_angel1[i] = CG.mat3x3Rotate(this.spin_matrix_angel1[i], this.angle1[i]);
                    this.models.slide3[0].transform2[i] = this.spin_matrix_trans1[i].mult(this.spin_matrix_angel1[i]);
                }

                this.shrink9[0] += this.s_offset9[0];

                for (let i = 0; i < 1; i++) {
                    this.scale_matrix_angel9[i] = CG.mat3x3Scale(this.scale_matrix_angel9[i], this.shrink9[i], this.shrink9[i]);
                    this.models.slide3[0].transform9[i] = this.scale_matrix_trans9[i].mult(this.scale_matrix_angel9[i]);
                }
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

        let slide0color = [128, 0, 178, 255];
        this.drawConvexPolygon(points, slide0color);    
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

        let points = [];
        //shape 1
        for (let i = 0; i < this.models.slide2[0].shapes[0].length; i++) {
            let v = this.models.slide2[0].transform[0].mult(this.models.slide2[0].shapes[0][i]);
            points[i] = v;
        }

        if (Math.round(points[0].values[0]) == Math.round(points[1].values[0])) {
            this.s_offset[0] *= -1;
            console.log(this.s_offset);
        } 

        if (points[0].values[1] > this.canvas.height - 100) {
            this.s_offset[0] *= -1;
            console.log(this.s_offset);
        }

        //console.log(points[0].values[0]);
        
        let color = [0, 128, 128, 255];
        this.drawConvexPolygon(points, color);

        let points2 = [];
        for (let i = 0; i < this.models.slide2[0].shapes5[0].length; i++) {
            let v = this.models.slide2[0].transform5[0].mult(this.models.slide2[0].shapes5[0][i]);
            points2[i] = v;
        }

        if (Math.round(points2[0].values[0]) == Math.round(points2[1].values[0])) {
            this.s_offset5[0] *= -1;
            console.log(this.s_offset5);
        } 

        if (points2[0].values[1] > this.canvas.height - 70) {
            this.s_offset5[0] *= -1;
            console.log(this.s_offset5);
        }

        //console.log(points[0].values[0]);
        
        color = [25, 118, 238, 70];
        this.drawConvexPolygon(points2, color);
    }

    //
    drawSlide3() {
        // TODO: get creative!
        //   - animation should involve all three basic transformation types
        //     (translation, scaling, and rotation)
        let points = [];
        let transform = this.models.slide3[0].transform;
        //console.log(this.models.slide0[0].vertices[0]);

        for (let i = 0; i < this.models.slide3[0].vertices.length; i++) {
            let v = transform.mult(this.models.slide3[0].vertices[i]);
            //console.log(v.values[0]);
            if (v.values[0] > this.canvas.width - 200 || v.values[0] < 0) {
                this.trans4X *= -1;
            }
            if (v.values[1] > this.canvas.height || v.values[1] < 0) {
                this.trans4Y *= -1;
            }
            points[i] = v;
        }

        let color = [128, 128, 10, 255];
        this.drawConvexPolygon(points, color);

        for (let i = 0; i < 1; i++) {
            points = [];

            for (let j = 0; j < this.models.slide3[0].shapes[i].length; j++) {
                let v = this.models.slide3[0].transform2[i].mult(this.models.slide3[0].shapes[i][j]);
                points[j] = v;
            }
            this.drawConvexPolygon(points, [238, 238, 10, 255]);
        }      
        
        let points1 = [];
        
        for (let i = 0; i < this.models.slide3[0].shapes9[0].length; i++) {
            let v = this.models.slide3[0].transform9[0].mult(this.models.slide3[0].shapes9[0][i]);
            points1[i] = v;
        }

        if (Math.round(points1[0].values[0]) == Math.round(points1[1].values[0])) {
            this.s_offset9[0] *= -1;
            console.log(this.s_offset9);
        } 

        if (points1[0].values[1] > this.canvas.height - 200) {
            this.s_offset9[0] *= -1;
            console.log(this.s_offset9);
        }

        //console.log(points[0].values[0]);
        let color9 = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 255];
    
        this.drawConvexPolygon(points1, color9);
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
