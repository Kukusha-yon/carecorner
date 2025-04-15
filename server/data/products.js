export const products = [
  // CISCO Switches
  {
    name: "Cisco Catalyst 9300-24T Switch",
    description: "Enterprise-grade network switch with advanced security features and high performance",
    price: 3499.99,
    category: "CISCO Switch",
    stock: 15,
    images: ["/images/products/cisco-9300-1.jpg", "/images/products/cisco-9300-2.jpg"],
    specifications: {
      Model: "C9300-24T",
      Ports: "24x 1G BaseT",
      Speed: "1 Gbps per port",
      Power: "PoE+ 740W",
      Management: "IOS-XE"
    },
    features: [
      "Stackable switch with StackWise technology",
      "Advanced security with Cisco TrustSec",
      "Application visibility with NBAR2",
      "Software-defined access ready",
      "Limited lifetime warranty"
    ],
    sku: "CSC-9300-24T",
    isFeatured: true
  },
  {
    name: "Cisco Nexus 9396 Switch",
    description: "High-performance data center switch for modern cloud infrastructure",
    price: 5999.99,
    category: "CISCO Switch",
    stock: 8,
    images: ["/images/products/nexus-9396-1.jpg", "/images/products/nexus-9396-2.jpg"],
    specifications: {
      Model: "N9K-9396PX",
      Ports: "48x 10G SFP+",
      Speed: "10/40/100 Gbps",
      Power: "Dual PSU",
      Management: "NX-OS"
    },
    features: [
      "High-density 10/40GbE ports",
      "Low latency and power consumption",
      "Advanced VXLAN support",
      "Comprehensive security features",
      "Cloud-ready architecture"
    ],
    sku: "CSC-NX-9396",
    isFeatured: true
  },

  // Servers
  {
    name: "PowerEdge R750 Rack Server",
    description: "Versatile 2U rack server designed for complex workloads and applications",
    price: 8999.99,
    category: "Server",
    stock: 5,
    images: ["/images/products/poweredge-r750-1.jpg", "/images/products/poweredge-r750-2.jpg"],
    specifications: {
      Processor: "2x Intel Xeon Gold 6330",
      RAM: "384GB DDR4",
      Storage: "8x 1.92TB SSD",
      "Form Factor": "2U Rack",
      "Power Supply": "Dual 1400W"
    },
    features: [
      "Support for up to 32 NVMe drives",
      "Advanced thermal design",
      "Integrated security features",
      "Remote management capabilities",
      "Expandable memory up to 8TB"
    ],
    sku: "SRV-R750-01",
    isFeatured: true
  },
  {
    name: "ThinkSystem SR650 V2",
    description: "Enterprise server for mission-critical workloads and virtualization",
    price: 7499.99,
    category: "Server",
    stock: 7,
    images: ["/images/products/sr650-1.jpg", "/images/products/sr650-2.jpg"],
    specifications: {
      Processor: "2x Intel Xeon Gold 5318Y",
      RAM: "256GB DDR4",
      Storage: "6x 2.4TB SAS",
      "Form Factor": "2U Rack",
      "Power Supply": "Dual 1100W"
    },
    features: [
      "Support for GPU acceleration",
      "TPM 2.0 security",
      "XClarity Controller",
      "Energy-efficient design",
      "Hot-swap components"
    ],
    sku: "SRV-SR650-02",
    isFeatured: false
  },

  // Monitors
  {
    name: "Dell UltraSharp 32 4K",
    description: "Professional 4K monitor with exceptional color accuracy and USB-C connectivity",
    price: 999.99,
    category: "Monitors",
    stock: 20,
    images: ["/images/products/ultrasharp-32-1.jpg", "/images/products/ultrasharp-32-2.jpg"],
    specifications: {
      Size: "31.5-inch",
      Resolution: "3840 x 2160",
      "Panel Type": "IPS",
      "Refresh Rate": "60 Hz",
      "Response Time": "5ms GtG"
    },
    features: [
      "99% sRGB color coverage",
      "USB-C with 90W power delivery",
      "Picture-by-Picture mode",
      "Factory calibrated",
      "ComfortView Plus"
    ],
    sku: "MON-U32-4K",
    isFeatured: true
  },
  {
    name: "LG UltraGear 27GN950",
    description: "Professional gaming monitor with 4K resolution and 144Hz refresh rate",
    price: 799.99,
    category: "Monitors",
    stock: 15,
    images: ["/images/products/ultragear-27-1.jpg", "/images/products/ultragear-27-2.jpg"],
    specifications: {
      Size: "27-inch",
      Resolution: "3840 x 2160",
      "Panel Type": "Nano IPS",
      "Refresh Rate": "144 Hz",
      "Response Time": "1ms GtG"
    },
    features: [
      "NVIDIA G-SYNC Compatible",
      "DisplayHDR 600",
      "98% DCI-P3 color gamut",
      "RGB Sphere Lighting 2.0",
      "Hardware calibration"
    ],
    sku: "MON-LG27-4K",
    isFeatured: false
  },

  // Logitech World
  {
    name: "Logitech MX Master 3S",
    description: "Advanced wireless mouse with customizable buttons and ergonomic design",
    price: 99.99,
    category: "Logitech World",
    stock: 30,
    images: ["/images/products/mx-master-3s-1.jpg", "/images/products/mx-master-3s-2.jpg"],
    specifications: {
      Type: "Wireless Mouse",
      Connectivity: "Bluetooth/USB",
      "Battery Life": "70 days",
      Features: "8K DPI sensor"
    },
    features: [
      "MagSpeed electromagnetic scrolling",
      "Track on any surface with Darkfield",
      "USB-C quick charging",
      "Multi-device support",
      "Customizable buttons"
    ],
    sku: "LOG-MX3S-01",
    isFeatured: true
  },
  {
    name: "Logitech MX Keys Advanced",
    description: "Premium wireless keyboard with backlit keys and multi-device support",
    price: 119.99,
    category: "Logitech World",
    stock: 25,
    images: ["/images/products/mx-keys-1.jpg", "/images/products/mx-keys-2.jpg"],
    specifications: {
      Type: "Wireless Keyboard",
      Connectivity: "Bluetooth/USB",
      "Battery Life": "10 days with backlight",
      Features: "Smart illumination"
    },
    features: [
      "Perfect stroke keys",
      "Proximity sensors",
      "USB-C charging",
      "Multi-device support",
      "Flow cross-computer control"
    ],
    sku: "LOG-MXK-01",
    isFeatured: false
  },

  // Bags
  {
    name: "Professional Tech Backpack",
    description: "Premium laptop backpack with multiple compartments and water resistance",
    price: 129.99,
    category: "Bags",
    stock: 40,
    images: ["/images/products/tech-backpack-1.jpg", "/images/products/tech-backpack-2.jpg"],
    specifications: {
      Material: "Ballistic Nylon",
      Capacity: "25L",
      Dimensions: "18\" x 12\" x 7\"",
      Weight: "2.5 lbs",
      Features: "Water-resistant"
    },
    features: [
      "Dedicated laptop compartment (up to 17\")",
      "RFID-protected pocket",
      "USB charging port",
      "Trolley strap",
      "Hidden security pocket"
    ],
    sku: "BAG-TECH-01",
    isFeatured: true
  },
  {
    name: "Executive Laptop Briefcase",
    description: "Stylish and professional laptop briefcase with leather accents",
    price: 149.99,
    category: "Bags",
    stock: 35,
    images: ["/images/products/briefcase-1.jpg", "/images/products/briefcase-2.jpg"],
    specifications: {
      Material: "Leather/Nylon",
      Capacity: "15L",
      Dimensions: "16\" x 12\" x 4\"",
      Weight: "2.2 lbs",
      Features: "Expandable"
    },
    features: [
      "Premium leather handles",
      "Padded laptop sleeve (15.6\")",
      "Organizer pockets",
      "Removable shoulder strap",
      "Document compartment"
    ],
    sku: "BAG-EXEC-01",
    isFeatured: false
  },

  // Chargers
  {
    name: "100W GaN USB-C Charger",
    description: "Compact and powerful GaN charger with multiple ports",
    price: 79.99,
    category: "Charger",
    stock: 50,
    images: ["/images/products/gan-charger-1.jpg", "/images/products/gan-charger-2.jpg"],
    specifications: {
      "Power Output": "100W Total",
      "Input Voltage": "100-240V",
      Compatibility: "Universal",
      Features: "GaN Technology"
    },
    features: [
      "3 USB-C + 1 USB-A ports",
      "Power Delivery 3.0",
      "Intelligent power distribution",
      "Compact design",
      "Safety protection"
    ],
    sku: "CHG-GAN-100",
    isFeatured: true
  },
  {
    name: "Wireless Charging Pad Pro",
    description: "Fast wireless charging pad with multiple device support",
    price: 49.99,
    category: "Charger",
    stock: 45,
    images: ["/images/products/wireless-pad-1.jpg", "/images/products/wireless-pad-2.jpg"],
    specifications: {
      "Power Output": "15W",
      "Input Voltage": "QC 3.0",
      Compatibility: "Qi-certified",
      Features: "Multi-coil design"
    },
    features: [
      "15W fast charging",
      "Multiple device positioning",
      "LED charging indicator",
      "Foreign object detection",
      "Anti-slip surface"
    ],
    sku: "CHG-WL-15W",
    isFeatured: false
  }
]; 