class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // num_curve_sections:  int
    constructor(canvas, num_curve_sections, show_points_flag) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d', {willReadFrequently: true});
        this.slide_idx = 0;
        this.num_curve_sections = num_curve_sections;
        this.show_points = show_points_flag;
    }

    // n:  int
    setNumCurveSections(n) {
        this.num_curve_sections = n;
        this.drawSlide(this.slide_idx);
    }

    // flag:  bool
    showPoints(flag) {
        this.show_points = flag;
        this.drawSlide(this.slide_idx);
    }
    
    // slide_idx:  int
    drawSlide(slide_idx) {
        this.slide_idx = slide_idx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let framebuffer = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(framebuffer);
                break;
            case 1:
                this.drawSlide1(framebuffer);
                break;
            case 2:
                this.drawSlide2(framebuffer);
                break;
            case 3:
                this.drawSlide3(framebuffer);
                break;
        }

        this.ctx.putImageData(framebuffer, 0, 0);
    }

    // framebuffer:  canvas ctx image data
    drawSlide0(framebuffer) {
        // TODO: draw at least 2 Bezier curves
        //   - variable `this.num_curve_sections` should be used for `num_edges`
        //   - variable `this.show_points` should be used to determine whether or not to render vertices

        // Coordinates for first curve
        let p0first = {x: 100, y: 100};
        let p1first = {x: 200, y: 50};
        let p2first = {x: 300, y: 150};
        let p3first = {x: 400, y: 100};

        // Coordinates for second curve
        let p0second = {x: 200, y: 500};
        let p1second = {x: 400, y: 250};
        let p2second = {x: 600, y: 450};
        let p3second = {x: 700, y: 300};
        
        this.drawBezierCurve(p0first, p1first, p2first, p3first, this.num_curve_sections, [255, 0, 0, 255], framebuffer);
        this.drawBezierCurve(p0second, p1second, p2second, p3second, this.num_curve_sections, [0, 0, 255, 255], framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide1(framebuffer) {
        // TODO: draw at least 2 circles
        //   - variable `this.num_curve_sections` should be used for `num_edges`
        //   - variable `this.show_points` should be used to determine whether or not to render vertices

        // Parameters for first circle
        let center1 = {x:200, y: 200};
        let radius1 = 50;
        let color1 = [255, 0, 0, 255];

        // Parameters for second circle
        let center2 = {x:600, y: 350};
        let radius2 = 150;
        let color2 = [0, 0, 255, 255];

        this.drawCircle(center1, radius1, this.num_curve_sections, color1, framebuffer);
        this.drawCircle(center2, radius2, this.num_curve_sections, color2, framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide2(framebuffer) {
        // TODO: draw at least 2 convex polygons (each with a different number of vertices >= 5)
        //   - variable `this.show_points` should be used to determine whether or not to render vertices
        
        // Define vertices for first convex polygon
        let vertices1 = [{x: 100, y: 100}, {x: 200, y: 150}, {x: 250, y: 200}, {x: 150, y: 250}];

        // Define vertices for second convex polygon
        let vertices2 = [{x: 300, y: 250}, {x: 400, y: 500}, {x: 475, y: 400}, {x: 250, y: 350}];

        this.drawConvexPolygon(vertices1, [255, 0, 0, 255], framebuffer);
        this.drawConvexPolygon(vertices2, [0, 0, 255, 255], framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide3(framebuffer) {
        // TODO: draw your name!
        //   - variable `this.num_curve_sections` should be used for `num_edges`
        //   - variable `this.show_points` should be used to determine whether or not to render vertices
        
        
    }

    // p0:           object {x: __, y: __}
    // p1:           object {x: __, y: __}
    // p2:           object {x: __, y: __}
    // p3:           object {x: __, y: __}
    // num_edges:    int
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawBezierCurve(p0, p1, p2, p3, num_edges, color, framebuffer) {
        // Calculate step size for t
        let step = 1 / num_edges;

        // Initialize previous point variable
        let previous;

        // Iterate over the curve in segments
        for (let t = 0; t <= 1; t += step) {
            // Calculate coordinates of current point
            let c0 = (1 - t) ** 3;
            let c1 = 3 * t * ((1 - t) ** 2);
            let c2 = 3 * (t ** 2) * (1 - t);
            let c3 = t ** 3;
            let x = Math.round(p0.x * c0 + p1.x * c1 + p2.x * c2 + p3.x * c3);
            let y = Math.round(p0.y * c0 + p1.y * c1 + p2.y * c2 + p3.y * c3);

            // Connect line from previous point to current point
            if (previous) {
                this.drawLine(previous, {x: x, y: y}, color, framebuffer)
            }

            // Update previous point
            previous = {x: x, y: y}
        }
    }

    // center:       object {x: __, y: __}
    // radius:       int
    // num_edges:    int
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawCircle(center, radius, num_edges, color, framebuffer) {
        // Initialize center coordinates
        let center_x = center.x;
        let center_y = center.y;

        // Calculate the step size of the angle
        let step = (2 * Math.PI) / num_edges;

        // Initialize the first and previous point
        let first;
        let previous;

        // Iterate over each side
        for (let i = 0; i < num_edges; i++) {
            // Calculate the current side's angle
            let angle = i * step;

            // Calculate the x and y coordinates of the current point
            let x = Math.round(center_x + radius * Math.cos(angle));
            let y = Math.round(center_y + radius * Math.sin(angle));

            // Save first ponit or connect line from previous point to current point
            if (i === 0) {
                first = {x: x, y: y};
            } else {
                this.drawLine(previous, {x: x, y: y}, color, framebuffer);
            }

            // Update previous point
            previous = {x: x, y: y};
        }

        // Draw final line segment to close the circle
        this.drawLine(previous, first, color, framebuffer);
    }
    
    // vertex_list:  array of object [{x: __, y: __}, {x: __, y: __}, ..., {x: __, y: __}]
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawConvexPolygon(vertex_list, color, framebuffer) {
        // Iterate over each vertex in the list
        for (let i = 1; i < vertex_list.length - 1; i++) {
            // Define the vertices of the current triangle
            let v0 = vertex_list[0];
            let v1 = vertex_list[i];
            let v2 = vertex_list[i + 1];

            // Draw current triangle
            this.drawTriangle(v0, v1, v2, color, framebuffer);
        }
        
        
    }
    
    // v:            object {x: __, y: __}
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawVertex(v, color, framebuffer) {
        // Define the pixel size of a cross symbol
        const size = 3;

        // Calculate coordinates for the start and end points of the lines
        let x0 = Math.round(v.x - size / 2);
        let x1 = Math.round(v.x + size / 2);
        let y0 = Math.round(v.y - size / 2);
        let y1 = Math.round(v.y + size / 2);

        // Draw vertical line
        this.drawLine({x: v.x, y: y0}, {x: v.x, y: y1}, color, framebuffer);

        // Draw horizontal line
        this.drawLine({x: x0, y: v.y}, {x: x1, y: v.y}, color, framebuffer);
    }
    
    /***************************************************************
     ***       Basic Line and Triangle Drawing Routines          ***
     ***       (code provided from in-class activities)          ***
     ***************************************************************/
    pixelIndex(x, y, framebuffer) {
	    return 4 * y * framebuffer.width + 4 * x;
    }
    
    setFramebufferColor(color, x, y, framebuffer) {
	    let p_idx = this.pixelIndex(x, y, framebuffer);
        for (let i = 0; i < 4; i++) {
            framebuffer.data[p_idx + i] = color[i];
        }
    }
    
    swapPoints(a, b) {
        let tmp = {x: a.x, y: a.y};
        a.x = b.x;
        a.y = b.y;
        b.x = tmp.x;
        b.y = tmp.y;
    }

    drawLine(p0, p1, color, framebuffer) {
        if (Math.abs(p1.y - p0.y) <= Math.abs(p1.x - p0.x)) { // |m| <= 1
            if (p0.x < p1.x) {
                this.drawLineLow(p0.x, p0.y, p1.x, p1.y, color, framebuffer);
            }
            else {
                this.drawLineLow(p1.x, p1.y, p0.x, p0.y, color, framebuffer);
            }
        }
        else {                                                // |m| > 1
            if (p0.y < p1.y) {
                this.drawLineHigh(p0.x, p0.y, p1.x, p1.y, color, framebuffer);
            }
            else {
                this.drawLineHigh(p1.x, p1.y, p0.x, p0.y, color, framebuffer);
            }
        }
    }
    
    drawLineLow(x0, y0, x1, y1, color, framebuffer) {
        let A = y1 - y0;
        let B = x0 - x1;
        let iy = 1; // y increment (+1 for positive slope, -1 for negative slop)
        if (A < 0) {
            iy = -1;
            A *= -1;
        }
        let D = 2 * A + B;
        let D0 = 2 * A;
        let D1 = 2 * A + 2 * B;
    
        let y = y0;
        for (let x = x0; x <= x1; x++) {
            this.setFramebufferColor(color, x, y, framebuffer);
            if (D <= 0) {
                D += D0;
            }
            else {
                D += D1;
                y += iy;
            }
        }
    }
    
    drawLineHigh(x0, y0, x1, y1, color, framebuffer) {
        let A = x1 - x0;
        let B = y0 - y1;
        let ix = 1; // x increment (+1 for positive slope, -1 for negative slop)
        if (A < 0) {
            ix = -1;
            A *= -1;
        }
        let D = 2 * A + B;
        let D0 = 2 * A;
        let D1 = 2 * A + 2 * B;
    
        let x = x0;
        for (let y = y0; y <= y1; y++) {
            this.setFramebufferColor(color, x, y, framebuffer);
            if (D <= 0) {
                D += D0;
            }
            else {
                D += D1;
                x += ix;
            }
        }
    }
    
    drawTriangle(p0, p1, p2, color, framebuffer) {
        // Deep copy, then sort points in ascending y order
        p0 = {x: p0.x, y: p0.y};
        p1 = {x: p1.x, y: p1.y};
        p2 = {x: p2.x, y: p2.y};
        if (p1.y < p0.y) this.swapPoints(p0, p1);
        if (p2.y < p0.y) this.swapPoints(p0, p2);
        if (p2.y < p1.y) this.swapPoints(p1, p2);
        
        // Edge coherence triangle algorithm
        // Create initial edge table
        let edge_table = [
            {x: p0.x, inv_slope: (p1.x - p0.x) / (p1.y - p0.y)}, // edge01
            {x: p0.x, inv_slope: (p2.x - p0.x) / (p2.y - p0.y)}, // edge02
            {x: p1.x, inv_slope: (p2.x - p1.x) / (p2.y - p1.y)}  // edge12
        ];
        
        // Do cross product to determine if pt1 is to the right/left of edge02
        let v01 = {x: p1.x - p0.x, y: p1.y - p0.y};
        let v02 = {x: p2.x - p0.x, y: p2.y - p0.y};
        let p1_right = ((v01.x * v02.y) - (v01.y * v02.x)) >= 0;
        
        // Get the left and right edges from the edge table (lower half of triangle)
        let left_edge, right_edge;
        if (p1_right) {
            left_edge = edge_table[1];
            right_edge = edge_table[0];
        }
        else {
            left_edge = edge_table[0];
            right_edge = edge_table[1];
        }
        // Draw horizontal lines (lower half of triangle)
        for (let y = p0.y; y < p1.y; y++) {
            let left_x = parseInt(left_edge.x) + 1;
            let right_x = parseInt(right_edge.x);
            if (left_x <= right_x) { 
                this.drawLine({x: left_x, y: y}, {x: right_x, y: y}, color, framebuffer);
            }
            left_edge.x += left_edge.inv_slope;
            right_edge.x += right_edge.inv_slope;
        }
        
        // Get the left and right edges from the edge table (upper half of triangle) - note only one edge changes
        if (p1_right) {
            right_edge = edge_table[2];
        }
        else {
            left_edge = edge_table[2];
        }
        // Draw horizontal lines (upper half of triangle)
        for (let y = p1.y; y < p2.y; y++) {
            let left_x = parseInt(left_edge.x) + 1;
            let right_x = parseInt(right_edge.x);
            if (left_x <= right_x) {
                this.drawLine({x: left_x, y: y}, {x: right_x, y: y}, color, framebuffer);
            }
            left_edge.x += left_edge.inv_slope;
            right_edge.x += right_edge.inv_slope;
        }
    }
};

export { Renderer };
