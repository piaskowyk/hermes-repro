// Constants
const G = 6.67430e-11; // Gravitational constant

// Particle class that represents a body in space
class Particle {
    constructor(mass, position, velocity) {
        this.mass = mass;
        this.position = position; // { x: Number, y: Number }
        this.velocity = velocity; // { x: Number, y: Number }
        this.force = { x: 0, y: 0 };
    }
}

// Function to calculate the distance between two particles
function distance(p1, p2) {
    const dx = p2.position.x - p1.position.x;
    const dy = p2.position.y - p1.position.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Function to compute gravitational force between two particles
function computeForce(p1, p2) {
    const dist = distance(p1, p2);
    if (dist === 0) return { x: 0, y: 0 };

    const forceMagnitude = (G * p1.mass * p2.mass) / (dist * dist);
    const dx = p2.position.x - p1.position.x;
    const dy = p2.position.y - p1.position.y;

    return {
        x: forceMagnitude * (dx / dist),
        y: forceMagnitude * (dy / dist)
    };
}

// Function to update forces on all particles
function updateForces(particles) {
    // Reset forces
    for (let p of particles) {
        p.force.x = 0;
        p.force.y = 0;
    }

    // Calculate forces
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const force = computeForce(particles[i], particles[j]);
            particles[i].force.x += force.x;
            particles[i].force.y += force.y;
            particles[j].force.x -= force.x;
            particles[j].force.y -= force.y;
        }
    }
}

// Function to update particle positions and velocities
function updateParticles(particles, dt) {
    for (let p of particles) {
        // Update velocities
        p.velocity.x += (p.force.x / p.mass) * dt;
        p.velocity.y += (p.force.y / p.mass) * dt;

        // Update positions
        p.position.x += p.velocity.x * dt;
        p.position.y += p.velocity.y * dt;
    }
}

// Simulation function
export function simulate(particles, duration, dt) {
    const steps = Math.floor(duration / dt);
    for (let step = 0; step < steps; step++) {
        updateForces(particles);
        updateParticles(particles, dt);
    }
}

// Example usage
const particles = [
    new Particle(1e6, { x: 0, y: 0 }, { x: 0, y: 0 }),
    new Particle(1e6, { x: 1, y: 0 }, { x: 0, y: 1 }),
    new Particle(1e6, { x: -1, y: 1 }, { x: 0, y: -1 })
];

export const runSimulation = () => simulate(particles, 10, 0.01);
