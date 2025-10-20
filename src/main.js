import { GLContext, Program, VertexArray } from './webgl/index.js';
import { loadShaders } from './shaders/loader.js';

class SimpleTriangle {
    constructor(canvas) {
        this.glContext = new GLContext(canvas, {
            antialias: true,
            alpha: false
        });
        
        this.gl = this.glContext.getContext();
        
        this.glContext.setClearColor(0,0,0,0);
    }

    async init() {
        await this.initShaders();
        this.initGeometry();
    }

    async initShaders() {
        const shaders = await loadShaders({
            vertex: './src/shaders/triangle.vert',
            fragment: './src/shaders/triangle.frag'
        });

        this.program = new Program(this.gl, shaders.vertex, shaders.fragment);
    }

    initGeometry() {
        
        const positions = new Float32Array([
             0.0,  0.5,   
            -0.5, -0.5,   
             0.5, -0.5    
        ]);

        
        const colors = new Float32Array([
            1.0, 0.0, 0.0,   
            0.0, 1.0, 0.0,   
            0.0, 0.0, 1.0    
        ]);

        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

        this.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, colors, this.gl.STATIC_DRAW);

        this.vao = new VertexArray(this.gl);
        
        
        const positionLoc = this.program.getAttributeLocation('a_position');
        if (positionLoc !== -1) {
            this.vao.addAttribute(positionLoc, this.positionBuffer, 2);
        }
        
        
        const colorLoc = this.program.getAttributeLocation('a_color');
        if (colorLoc !== -1) {
            this.vao.addAttribute(colorLoc, this.colorBuffer, 3);
        }
    }

    render() {
        
        this.glContext.clear();

        
        this.program.use();

        
        this.vao.draw(this.gl.TRIANGLES, 3);
    }

    cleanup() {
        this.program.delete();
        this.gl.deleteBuffer(this.positionBuffer);
        this.gl.deleteBuffer(this.colorBuffer);
        this.vao.delete();
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.getElementById('glcanvas');
    const triangle = new SimpleTriangle(canvas);
    
    try {
        await triangle.init();
        
        triangle.render();
        
        window.addEventListener('resize', () => {
            const rect = canvas.getBoundingClientRect();
            triangle.glContext.resize(rect.width, rect.height);
            triangle.render();
        });
    } catch (error) {
        console.error('Failed to initialize triangle:', error);
    }
});
