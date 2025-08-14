import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import HealthCalculator from './HealthCalculator';
import './ThreeDAssessment.css';

const ThreeDAssessment = ({ onClose }) => {
  const mountRef = useRef(null);
  const [popupContent, setPopupContent] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('normal'); // normal, xray, thermal, anatomical
  const [symptoms, setSymptoms] = useState('');
  const [highlightedParts, setHighlightedParts] = useState([]);
  const [showSymptomChecker, setShowSymptomChecker] = useState(false);
  const [showHealthCalculator, setShowHealthCalculator] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState([]);

  // Enhanced health data with comprehensive medical information
  const healthData = {
    "Head": {
      title: "🧠 Neurological Assessment",
      symptoms: ["headache", "migraine", "dizziness", "confusion", "memory loss"],
      conditions: [
        {
          name: "Tension Headache",
          symptoms: ["Pressure around head", "Neck stiffness", "Stress-related"],
          severity: "mild",
          treatment: "Rest, stress management, over-the-counter pain relievers"
        },
        {
          name: "Migraine",
          symptoms: ["Severe one-sided pain", "Nausea", "Light sensitivity", "Aura"],
          severity: "moderate",
          treatment: "Prescription medications, dark room rest, trigger avoidance"
        },
        {
          name: "Concussion",
          symptoms: ["Headache after injury", "Confusion", "Memory problems", "Dizziness"],
          severity: "urgent",
          treatment: "Immediate medical evaluation required"
        }
      ],
      emergency: ["Severe sudden headache", "Confusion with fever", "Headache with stiff neck"],
      tests: ["Neurological exam", "CT scan", "MRI", "Cognitive assessment"]
    },
    "Neck": {
      title: "🦴 Cervical Spine Health",
      symptoms: ["neck pain", "stiffness", "numbness", "tingling", "weakness"],
      conditions: [
        {
          name: "Cervical Strain",
          symptoms: ["Muscle pain", "Stiffness", "Limited range of motion"],
          severity: "mild",
          treatment: "Rest, gentle stretching, heat therapy"
        },
        {
          name: "Cervical Radiculopathy",
          symptoms: ["Arm pain", "Numbness", "Weakness", "Tingling"],
          severity: "moderate",
          treatment: "Physical therapy, medications, possible surgery"
        }
      ],
      emergency: ["Severe neck pain with fever", "Neck pain with weakness", "Neck pain after trauma"],
      tests: ["Range of motion", "Neurological exam", "X-ray", "MRI"]
    },
    "Left Arm": {
      title: "💪 Left Upper Extremity",
      symptoms: ["arm pain", "numbness", "weakness", "swelling", "stiffness"],
      conditions: [
        {
          name: "Rotator Cuff Strain",
          symptoms: ["Shoulder pain", "Weakness", "Limited overhead movement"],
          severity: "moderate",
          treatment: "Rest, physical therapy, anti-inflammatory medications"
        },
        {
          name: "Carpal Tunnel Syndrome",
          symptoms: ["Hand numbness", "Tingling", "Weakness", "Night symptoms"],
          severity: "moderate",
          treatment: "Wrist splints, ergonomic adjustments, possible surgery"
        }
      ],
      emergency: ["Severe arm pain", "Arm weakness with chest pain", "Arm swelling with shortness of breath"],
      tests: ["Strength testing", "Range of motion", "Nerve conduction studies"]
    },
    "Right Arm": {
      title: "💪 Right Upper Extremity",
      symptoms: ["arm pain", "numbness", "weakness", "swelling", "stiffness"],
      conditions: [
        {
          name: "Tennis Elbow",
          symptoms: ["Outer elbow pain", "Grip weakness", "Pain with wrist extension"],
          severity: "moderate",
          treatment: "Rest, physical therapy, bracing, possible injections"
        },
        {
          name: "Frozen Shoulder",
          symptoms: ["Stiffness", "Pain", "Limited movement"],
          severity: "moderate",
          treatment: "Physical therapy, stretching, possible manipulation"
        }
      ],
      emergency: ["Severe arm pain", "Arm weakness with chest pain", "Arm swelling with shortness of breath"],
      tests: ["Strength testing", "Range of motion", "X-ray", "MRI"]
    },
    "Left Leg": {
      title: "🦵 Left Lower Extremity",
      symptoms: ["leg pain", "swelling", "numbness", "weakness", "cramps"],
      conditions: [
        {
          name: "Muscle Strain",
          symptoms: ["Pain with movement", "Swelling", "Bruising"],
          severity: "mild",
          treatment: "RICE protocol, rest, gradual return to activity"
        },
        {
          name: "Sciatica",
          symptoms: ["Back pain radiating to leg", "Numbness", "Tingling"],
          severity: "moderate",
          treatment: "Physical therapy, medications, possible injections"
        }
      ],
      emergency: ["Severe leg pain", "Leg swelling with chest pain", "Leg weakness with back pain"],
      tests: ["Strength testing", "Range of motion", "X-ray", "MRI"]
    },
    "Right Leg": {
      title: "🦵 Right Lower Extremity",
      symptoms: ["leg pain", "swelling", "numbness", "weakness", "cramps"],
      conditions: [
        {
          name: "Knee Pain",
          symptoms: ["Pain with movement", "Swelling", "Stiffness"],
          severity: "moderate",
          treatment: "Rest, ice, compression, elevation, physical therapy"
        },
        {
          name: "Plantar Fasciitis",
          symptoms: ["Heel pain", "Morning stiffness", "Pain with walking"],
          severity: "moderate",
          treatment: "Stretching, orthotics, physical therapy"
        }
      ],
      emergency: ["Severe leg pain", "Leg swelling with chest pain", "Leg weakness with back pain"],
      tests: ["Strength testing", "Range of motion", "X-ray", "MRI"]
    },
    "Chest": {
      title: "🫁 Thoracic Assessment",
      symptoms: ["chest pain", "shortness of breath", "cough", "tightness", "palpitations"],
      conditions: [
        {
          name: "Costochondritis",
          symptoms: ["Chest wall pain", "Tenderness", "Pain with movement"],
          severity: "mild",
          treatment: "Rest, anti-inflammatory medications, heat therapy"
        },
        {
          name: "Anxiety",
          symptoms: ["Chest tightness", "Rapid breathing", "Palpitations"],
          severity: "mild",
          treatment: "Breathing exercises, stress management, therapy"
        }
      ],
      emergency: ["Severe chest pain", "Chest pain with shortness of breath", "Chest pain radiating to arm"],
      tests: ["EKG", "Chest X-ray", "Blood tests", "Stress test"]
    },
    "Heart": {
      title: "❤️ Cardiovascular Health",
      symptoms: ["chest pain", "palpitations", "shortness of breath", "fatigue", "dizziness"],
      conditions: [
        {
          name: "Atrial Fibrillation",
          symptoms: ["Irregular heartbeat", "Palpitations", "Fatigue", "Shortness of breath"],
          severity: "moderate",
          treatment: "Medications, cardioversion, possible ablation"
        },
        {
          name: "Hypertension",
          symptoms: ["Often asymptomatic", "Headaches", "Dizziness", "Chest pain"],
          severity: "moderate",
          treatment: "Lifestyle changes, medications, regular monitoring"
        }
      ],
      emergency: ["Severe chest pain", "Chest pain with shortness of breath", "Fainting with chest pain"],
      tests: ["EKG", "Echocardiogram", "Stress test", "Holter monitor"]
    },
    "Spine": {
      title: "🦴 Spinal Health",
      symptoms: ["back pain", "numbness", "tingling", "weakness", "stiffness"],
      conditions: [
        {
          name: "Lower Back Pain",
          symptoms: ["Pain with movement", "Stiffness", "Muscle spasms"],
          severity: "moderate",
          treatment: "Physical therapy, medications, exercise, ergonomic adjustments"
        },
        {
          name: "Sciatica",
          symptoms: ["Back pain radiating to leg", "Numbness", "Tingling"],
          severity: "moderate",
          treatment: "Physical therapy, medications, possible injections"
        }
      ],
      emergency: ["Severe back pain", "Back pain with weakness", "Back pain with bowel/bladder changes"],
      tests: ["Physical exam", "X-ray", "MRI", "Nerve conduction studies"]
    }
  };

  // Symptom checker function
  const checkSymptoms = (symptomText) => {
    const lowerSymptoms = symptomText.toLowerCase();
    const matchedParts = [];
    
    Object.entries(healthData).forEach(([partName, data]) => {
      if (data.symptoms.some(symptom => lowerSymptoms.includes(symptom))) {
        matchedParts.push(partName);
      }
    });
    
    setHighlightedParts(matchedParts);
    return matchedParts;
  };

  // Enhanced popup content generator
  const generatePopupContent = (partName) => {
    const data = healthData[partName];
    if (!data) return '';

    return `
      <div class="medical-popup">
        <h2>${data.title}</h2>
        
        <div class="symptoms-section">
          <h3>🔍 Common Symptoms:</h3>
          <ul>
            ${data.symptoms.map(symptom => `<li>• ${symptom}</li>`).join('')}
          </ul>
        </div>

        <div class="conditions-section">
          <h3>🏥 Common Conditions:</h3>
          ${data.conditions.map(condition => `
            <div class="condition-card ${condition.severity}">
              <h4>${condition.name}</h4>
              <p><strong>Symptoms:</strong> ${condition.symptoms.join(', ')}</p>
              <p><strong>Severity:</strong> <span class="severity-${condition.severity}">${condition.severity.toUpperCase()}</span></p>
              <p><strong>Treatment:</strong> ${condition.treatment}</p>
            </div>
          `).join('')}
        </div>

        <div class="emergency-section">
          <h3>🚨 Emergency Signs:</h3>
          <ul class="emergency-list">
            ${data.emergency.map(symptom => `<li>⚠️ ${symptom}</li>`).join('')}
          </ul>
        </div>

        <div class="tests-section">
          <h3>🔬 Diagnostic Tests:</h3>
          <ul>
            ${data.tests.map(test => `<li>• ${test}</li>`).join('')}
          </ul>
        </div>

        <div class="action-buttons">
          <button class="btn-primary" onclick="window.open('tel:911')">🚨 Emergency</button>
          <button class="btn-secondary" onclick="window.open('https://www.mayoclinic.org')">📚 Learn More</button>
        </div>
      </div>
    `;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup with proper background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfff9db);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 6);
    camera.lookAt(0, 1.5, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0xfff9db, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced lighting for different view modes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0x8ec5ff, 0.4);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    // Materials for different view modes
    const materials = {
      normal: {
        skin: new THREE.MeshLambertMaterial({ color: 0xffdbac }),
        muscle: new THREE.MeshLambertMaterial({ color: 0xcc6666 }),
        cloth: new THREE.MeshLambertMaterial({ color: 0x2980b9 }),
        organ: new THREE.MeshLambertMaterial({ color: 0xff6b9d }),
        bone: new THREE.MeshLambertMaterial({ color: 0xf8f8ff })
      },
      xray: {
        skin: new THREE.MeshLambertMaterial({ color: 0x000000, transparent: true, opacity: 0.1 }),
        muscle: new THREE.MeshLambertMaterial({ color: 0x444444, transparent: true, opacity: 0.3 }),
        cloth: new THREE.MeshLambertMaterial({ color: 0x000000, transparent: true, opacity: 0.1 }),
        organ: new THREE.MeshLambertMaterial({ color: 0x666666, transparent: true, opacity: 0.5 }),
        bone: new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0x333333 })
      },
      thermal: {
        skin: new THREE.MeshLambertMaterial({ color: 0xff4444, emissive: 0x220000 }),
        muscle: new THREE.MeshLambertMaterial({ color: 0xff8800, emissive: 0x442200 }),
        cloth: new THREE.MeshLambertMaterial({ color: 0x444444 }),
        organ: new THREE.MeshLambertMaterial({ color: 0xff0000, emissive: 0x440000 }),
        bone: new THREE.MeshLambertMaterial({ color: 0x888888 })
      }
    };

    // Select materials based on current view mode
    let currentMaterials =
      viewMode === 'xray' ? materials.xray : viewMode === 'thermal' ? materials.thermal : materials.normal;

    // Store body parts for interaction
    const bodyParts = [];
    let hoveredObject = null;

    // Create detailed body parts with enhanced geometry
    function createDetailedBody() {
      // HEAD with enhanced detail
      const headGroup = new THREE.Group();
      
      const headGeometry = new THREE.SphereGeometry(0.55, 32, 32);
      const head = new THREE.Mesh(headGeometry, currentMaterials.skin);
      head.castShadow = true;
      head.receiveShadow = true;
      headGroup.add(head);

      // Enhanced eyes
      const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
      const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x4a4a4a });
      
      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      leftEye.position.set(-0.15, 0.1, 0.45);
      headGroup.add(leftEye);
      
      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      rightEye.position.set(0.15, 0.1, 0.45);
      headGroup.add(rightEye);

      // Enhanced nose
      const noseGeometry = new THREE.ConeGeometry(0.05, 0.15, 8);
      const nose = new THREE.Mesh(noseGeometry, currentMaterials.skin);
      nose.position.set(0, -0.05, 0.5);
      nose.rotation.x = Math.PI;
      headGroup.add(nose);

      headGroup.position.y = 2.8;
      headGroup.name = "Head";
      headGroup.userData = { clickable: true, partType: "neurological" };
      scene.add(headGroup);
      bodyParts.push(headGroup);

      // NECK
      const neckGeometry = new THREE.CylinderGeometry(0.18, 0.22, 0.4, 16);
      const neck = new THREE.Mesh(neckGeometry, currentMaterials.skin);
      neck.position.y = 2.4;
      neck.name = "Neck";
      neck.userData = { clickable: true, partType: "musculoskeletal" };
      neck.castShadow = true;
      neck.receiveShadow = true;
      scene.add(neck);
      bodyParts.push(neck);

      // Enhanced TORSO with organs
      const torsoGroup = new THREE.Group();
      
      const chestGeometry = new THREE.BoxGeometry(1.2, 0.8, 0.6);
      const chest = new THREE.Mesh(chestGeometry, currentMaterials.cloth);
      chest.position.y = 0.4;
      chest.castShadow = true;
      chest.receiveShadow = true;
      torsoGroup.add(chest);

      const abdomenGeometry = new THREE.BoxGeometry(1.0, 0.7, 0.5);
      const abdomen = new THREE.Mesh(abdomenGeometry, currentMaterials.cloth);
      abdomen.position.y = -0.2;
      torsoGroup.add(abdomen);

      // Enhanced heart with animation
      const heartGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const heart = new THREE.Mesh(heartGeometry, currentMaterials.organ);
      heart.position.set(-0.1, 0.3, 0.2);
      heart.name = "Heart";
      heart.userData = { clickable: true, partType: "cardiovascular" };
      torsoGroup.add(heart);

      // Add lungs
      const lungGeometry = new THREE.SphereGeometry(0.12, 16, 16);
      const leftLung = new THREE.Mesh(lungGeometry, currentMaterials.organ);
      leftLung.position.set(-0.3, 0.2, 0.1);
      leftLung.name = "Left Lung";
      leftLung.userData = { clickable: true, partType: "respiratory" };
      torsoGroup.add(leftLung);

      const rightLung = new THREE.Mesh(lungGeometry, currentMaterials.organ);
      rightLung.position.set(0.3, 0.2, 0.1);
      rightLung.name = "Right Lung";
      rightLung.userData = { clickable: true, partType: "respiratory" };
      torsoGroup.add(rightLung);

      torsoGroup.position.y = 1.5;
      torsoGroup.name = "Chest";
      torsoGroup.userData = { clickable: true, partType: "thoracic" };
      scene.add(torsoGroup);
      bodyParts.push(torsoGroup);

      // Enhanced ARMS
      function createArm(side) {
        const armGroup = new THREE.Group();
        
        const upperArmGeometry = new THREE.CylinderGeometry(0.12, 0.15, 0.8, 16);
        const upperArm = new THREE.Mesh(upperArmGeometry, currentMaterials.muscle);
        upperArm.position.y = 0.2;
        upperArm.castShadow = true;
        armGroup.add(upperArm);

        const elbowGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const elbow = new THREE.Mesh(elbowGeometry, currentMaterials.skin);
        elbow.position.y = -0.2;
        armGroup.add(elbow);

        const forearmGeometry = new THREE.CylinderGeometry(0.1, 0.12, 0.7, 16);
        const forearm = new THREE.Mesh(forearmGeometry, currentMaterials.skin);
        forearm.position.y = -0.55;
        forearm.castShadow = true;
        armGroup.add(forearm);

        const handGeometry = new THREE.BoxGeometry(0.15, 0.25, 0.08);
        const hand = new THREE.Mesh(handGeometry, currentMaterials.skin);
        hand.position.y = -1;
        armGroup.add(hand);

        // Enhanced fingers
        for(let i = 0; i < 4; i++) {
          const fingerGeometry = new THREE.CylinderGeometry(0.015, 0.02, 0.15, 8);
          const finger = new THREE.Mesh(fingerGeometry, currentMaterials.skin);
          finger.position.set((i-1.5)*0.03, -1.15, 0.02);
          armGroup.add(finger);
        }

        const x = side === 'left' ? -1 : 1;
        armGroup.position.set(x, 1.8, 0);
        armGroup.name = side === 'left' ? "Left Arm" : "Right Arm";
        armGroup.userData = { clickable: true, partType: "musculoskeletal" };
        scene.add(armGroup);
        bodyParts.push(armGroup);
      }

      createArm('left');
      createArm('right');

      // Enhanced LEGS
      function createLeg(side) {
        const legGroup = new THREE.Group();
        
        const thighGeometry = new THREE.CylinderGeometry(0.18, 0.22, 1.0, 16);
        const thigh = new THREE.Mesh(thighGeometry, currentMaterials.muscle);
        thigh.position.y = 0.2;
        thigh.castShadow = true;
        legGroup.add(thigh);

        const kneeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const knee = new THREE.Mesh(kneeGeometry, currentMaterials.bone);
        knee.position.y = -0.3;
        legGroup.add(knee);

        const shinGeometry = new THREE.CylinderGeometry(0.12, 0.18, 1.0, 16);
        const shin = new THREE.Mesh(shinGeometry, currentMaterials.muscle);
        shin.position.y = -0.8;
        shin.castShadow = true;
        legGroup.add(shin);

        const footGeometry = new THREE.BoxGeometry(0.25, 0.12, 0.6);
        const foot = new THREE.Mesh(footGeometry, currentMaterials.skin);
        foot.position.set(0, -1.35, 0.15);
        foot.castShadow = true;
        legGroup.add(foot);

        const x = side === 'left' ? -0.35 : 0.35;
        legGroup.position.set(x, 0.3, 0);
        legGroup.name = side === 'left' ? "Left Leg" : "Right Leg";
        legGroup.userData = { clickable: true, partType: "musculoskeletal" };
        scene.add(legGroup);
        bodyParts.push(legGroup);
      }

      createLeg('left');
      createLeg('right');

      // Enhanced SPINE
      const spineGroup = new THREE.Group();
      for(let i = 0; i < 12; i++) {
        const vertebraGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.08, 8);
        const vertebra = new THREE.Mesh(vertebraGeometry, currentMaterials.bone);
        vertebra.position.y = i * 0.12;
        spineGroup.add(vertebra);
      }
      spineGroup.position.set(0, 0.5, -0.3);
      spineGroup.name = "Spine";
      spineGroup.userData = { clickable: true, partType: "musculoskeletal" };
      scene.add(spineGroup);
      bodyParts.push(spineGroup);

      setLoading(false);
    }

    // Mouse interaction variables
    let isMouseDown = false;
    let mouseX = 0, mouseY = 0;
    let targetRotationX = 0, targetRotationY = 0;
    let rotationX = 0, rotationY = 0;

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Create the detailed body
    createDetailedBody();

    // Mouse event handlers
    const handleMouseDown = (event) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    const handleMouseMove = (event) => {
      if (isMouseDown) {
        const deltaX = event.clientX - mouseX;
        const deltaY = event.clientY - mouseY;
        
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
        targetRotationX = Math.max(-Math.PI/3, Math.min(Math.PI/3, targetRotationX));
        
        mouseX = event.clientX;
        mouseY = event.clientY;
      } else {
        // Enhanced hover detection with highlighting
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(bodyParts, true);
        
        if (intersects.length > 0) {
          const newHovered = intersects[0].object.parent || intersects[0].object;
          if (newHovered !== hoveredObject) {
            // Reset previous hover
            if (hoveredObject && hoveredObject.material) {
              hoveredObject.material.emissive.setHex(0x000000);
            }
            
            // Set new hover with enhanced highlighting
            hoveredObject = newHovered;
            if (hoveredObject.material) {
              const isHighlighted = highlightedParts.includes(hoveredObject.name);
              hoveredObject.material.emissive.setHex(isHighlighted ? 0x444400 : 0x333333);
            }
            document.body.style.cursor = 'pointer';
          }
        } else {
          if (hoveredObject && hoveredObject.material) {
            hoveredObject.material.emissive.setHex(0x000000);
          }
          hoveredObject = null;
          document.body.style.cursor = 'grab';
        }
      }
    };

    const handleClick = (event) => {
      if (isMouseDown) return;
      
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(bodyParts, true);
      
      if (intersects.length > 0) {
        const clickedObject = intersects[0].object.parent || intersects[0].object;
        const partName = clickedObject.name;
        
        if (healthData[partName]) {
          const content = generatePopupContent(partName);
          setPopupContent(content);
          setShowPopup(true);
          
          // Enhanced click effect
          if (clickedObject.material) {
            clickedObject.material.emissive.setHex(0x004400);
            setTimeout(() => {
              if (clickedObject.material) {
                clickedObject.material.emissive.setHex(0x000000);
              }
            }, 300);
          }

          // Add to medical history
          const historyEntry = {
            part: partName,
            timestamp: new Date().toISOString(),
            data: healthData[partName]
          };
          setMedicalHistory(prev => [...prev, historyEntry]);
        }
      }
    };

    const handleWheel = (event) => {
      event.preventDefault();
      camera.position.z += event.deltaY * 0.01;
      camera.position.z = Math.max(3, Math.min(12, camera.position.z));
    };

    // Add event listeners only on the canvas to avoid capturing the opening click
    const canvasEl = renderer.domElement;
    canvasEl.addEventListener('mousedown', handleMouseDown);
    canvasEl.addEventListener('mouseup', handleMouseUp);
    canvasEl.addEventListener('mousemove', handleMouseMove);
    canvasEl.addEventListener('click', handleClick);
    canvasEl.addEventListener('wheel', handleWheel, { passive: false });

    // Enhanced animation loop
    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.01;
      
      // Smooth rotation
      rotationX += (targetRotationX - rotationX) * 0.05;
      rotationY += (targetRotationY - rotationY) * 0.05;
      
      // Apply rotation with floating effect
      scene.rotation.x = rotationX;
      scene.rotation.y = rotationY;
      scene.position.y = Math.sin(time) * 0.02;
      
      // Enhanced heart animation
      const heartObj = scene.getObjectByName('Heart');
      if (heartObj) {
        heartObj.scale.setScalar(1 + Math.sin(time * 8) * 0.05);
        heartObj.rotation.y = time * 2;
      }

      // Lung breathing animation
      const leftLung = scene.getObjectByName('Left Lung');
      const rightLung = scene.getObjectByName('Right Lung');
      if (leftLung && rightLung) {
        const breathScale = 1 + Math.sin(time * 4) * 0.1;
        leftLung.scale.setScalar(breathScale);
        rightLung.scale.setScalar(breathScale);
      }
      
      renderer.render(scene, camera);
    }

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup
    return () => {
      if (renderer && renderer.domElement) {
        const el = renderer.domElement;
        el.removeEventListener('mousedown', handleMouseDown);
        el.removeEventListener('mouseup', handleMouseUp);
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('click', handleClick);
        el.removeEventListener('wheel', handleWheel);
      }
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, [viewMode, highlightedParts]);

  return (
    <div className="three-d-assessment">
      <div className="assessment-header">
        <button className="back-button" onClick={onClose}>
          ← BACK
        </button>
        <h1>🏥 Advanced 3D Medical Diagnosis System</h1>
        <div className="view-controls">
          <button 
            className={`view-btn ${viewMode === 'normal' ? 'active' : ''}`}
            onClick={() => setViewMode('normal')}
          >
            Normal
          </button>
          <button 
            className={`view-btn ${viewMode === 'xray' ? 'active' : ''}`}
            onClick={() => setViewMode('xray')}
          >
            X-Ray
          </button>
          <button 
            className={`view-btn ${viewMode === 'thermal' ? 'active' : ''}`}
            onClick={() => setViewMode('thermal')}
          >
            Thermal
          </button>
        </div>
      </div>

      <div className="toolbar">
        <button 
          className="tool-btn"
          onClick={() => setShowSymptomChecker(!showSymptomChecker)}
        >
          🔍 Symptom Checker
        </button>
        <button 
          className="tool-btn"
          onClick={() => setShowHealthCalculator(true)}
        >
          📊 Health Calculator
        </button>
        <button className="tool-btn">
          📝 Medical History
        </button>
      </div>

      {showSymptomChecker && (
        <div className="symptom-checker">
          <h3>🔍 Symptom Checker</h3>
          <input
            type="text"
            placeholder="Describe your symptoms..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="symptom-input"
          />
          <button 
            className="check-btn"
            onClick={() => checkSymptoms(symptoms)}
          >
            Check Symptoms
          </button>
          {highlightedParts.length > 0 && (
            <div className="highlighted-parts">
              <p>Relevant body parts:</p>
              <ul>
                {highlightedParts.map(part => (
                  <li key={part}>{part}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="loading">
          Loading Advanced 3D Model...
        </div>
      )}

      <div ref={mountRef} className="three-d-container" />

      {showPopup && (
        <div className="popup show">
          <div dangerouslySetInnerHTML={{ __html: popupContent }} />
          <button onClick={() => setShowPopup(false)}>Close Diagnosis</button>
        </div>
      )}

      <div className="instructions">
        <strong>🖱️ Controls:</strong><br />
        • Click on body parts for detailed diagnosis<br />
        • Drag to rotate model<br />
        • Scroll to zoom in/out<br />
        • Hover for part highlighting<br />
        • Use view modes for different perspectives<br />
        • Try the symptom checker for guided assessment
      </div>

      {showHealthCalculator && (
        <HealthCalculator onClose={() => setShowHealthCalculator(false)} />
      )}
    </div>
  );
};

export default ThreeDAssessment;
