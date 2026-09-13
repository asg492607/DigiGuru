# DigiGuru — Shared AI Digital School Campus

![DigiGuru Banner](https://raw.githubusercontent.com/asg492607/DigiGuru/main/public/vite.svg)

> **DigiGuru** is a complete, shared 3D digital school campus where students attend classes together, interact with embodied AI teachers, explore subjects through immersive experiences, and engage in personalized and collaborative activities.

---

## 🏛️ Campus Architecture & Master Plan

At the heart of DigiGuru is a 500,000 sq. ft. interconnected educational ecosystem centered around the **Chhatrapati Shivaji Maharaj Memorial Plaza**:

```text
                                  NORTH
               Senior College (Grades 11-12) • Admin Tower
                                    ▲
                                    │
    WEST                            │                            EAST
Primary School (Grades 1-5) ◄── CENTRAL QUAD ──► Secondary School (Grades 6-10)
Athletic Stadium & Library          │            Auditorium & Tech Bio-Dome
                                    ▼
               Early Years (Nursery, Jr KG, Sr KG)
               Grand Security Gate & School Bus Terminal
                                  SOUTH
```

---

## ✨ Key Features

### 1. 🏫 Realistic School Arrival & Security Gates
- **Dual Automated Sliding Wrought-Iron Gates**: Positioned at the South Main Gate (`[0, 0, 48]`). Gates automatically slide open with green LED access lights as students approach.
- **School Bus Terminal**: Official yellow DigiGuru school buses parked at the terminal loop, pedestrian zebra crossings, and a passenger waiting shelter with benches.
- **Perimeter Security**: Guard cabin with security gate arm and wrought-iron perimeter fencing.

### 2. 🚩 Central Quad & Wayfinding Street Furniture
- **Chhatrapati Shivaji Maharaj Memorial**: Multi-tier black granite pedestal, bronze statue, ceremonial marigold planters, saffron flags, and stone park benches.
- **Directional Signposts**: Cast-iron wayfinding posts at major boulevard intersections pointing to all 4 academic quadrants.
- **Campus Street Amenities**: 3-bin recycling sorting stations (Paper, Organic, Plastics), stainless steel drinking water cooler kiosks, and warm glowing cast-iron street lamps.
- **Athletic Grounds**: Regulation soccer pitch with 3D white goalposts and netting, 4-lane red tartan running track, and a basketball court with backboard and hoop.

### 3. 🎥 360° Dynamic Camera Orbit & Panoramic Zoom
- **Full Camera Freedom**: Right-click and drag (or use **Q** and **E** keys) to orbit 360° around the student avatar.
- **Mouse Wheel Zoom**: Smoothly pull back for high-elevation panoramic views or zoom in for an over-the-shoulder perspective.
- **Indoor Collision Clamping**: Camera position is automatically clamped inside rooms to prevent clipping into walls or ceilings.

### 4. 📚 Authentic Classroom Interiors
- **No Wall Clipping**: Indoor classroom rendering is separated from the exterior campus grounds to eliminate geometry clipping.
- **Detailed Furnishings**: Student double-desks with notebooks, sketchbooks, pencil caddies, and chairs; teacher's executive desk with laptop and attendance register; presentation podium with DigiGuru seal and microphone; dual rotating ceiling fans; recessed LED lighting; analog wall clock; and backpack cubbies.

### 5. 🔔 Timetable Schedule Engine & Teacher Entrance
- **Live Timetable HUD**: Top-center banner displays current period, time range, status badge (*Free Campus* vs *Class in Session*), and a **🔔 Ring School Bell** button.
- **Recess vs. Class In Session**: During recess, Miss Maya remains in the faculty lounge while students explore the campus. When the bell chimes, Miss Maya realistically enters through the classroom door, walks down the central aisle to the podium, greets the students, and begins teaching.
- **Minimizable Teaching Overlay**: An eye toggle (`👁️ Hide Panel`) collapses the lesson dialogue into a compact pill, allowing an unobstructed 3D view of the room and AR holograms.

### 6. 🗺️ Master Campus Map (2D Blueprint Schematic)
- Interactive 2D architectural blueprint layout of all 15 academic blocks, facilities, and gates with one-click fast-travel navigation.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19, TypeScript
- **3D Graphics & Rendering**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Styling**: Tailwind CSS, Lucide React Icons, Canvas Confetti
- **Audio & Speech Engine**: Web Audio API (procedural bell & star synthesizers), Web Speech API (AI Teacher voice synthesis)
- **Build Tooling**: Vite, Rollup

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/asg492607/DigiGuru.git

# Navigate to project directory
cd DigiGuru

# Install dependencies
npm install

# Start the local development server
npm run dev
```

The application will launch at `http://127.0.0.1:5173/`.

### Production Build

```bash
npm run build
```

---

## 🎮 Controls

| Action | Control |
|---|---|
| **Move** | `W`, `A`, `S`, `D` or Virtual Joystick / Click-to-Walk |
| **Jump** | `Spacebar` |
| **Orbit Camera** | Right-Click Drag or `Q` / `E` keys |
| **Zoom Camera** | Mouse Scroll Wheel |
| **Emotes** | Wave, Cheer, Sit buttons in HUD |
| **Campus Map** | Click `Campus Blueprint` in top-right HUD |
| **School Bell** | Click `🔔 Ring Bell` in top Schedule Banner |

---

## 📄 License

This project is licensed under the MIT License.
