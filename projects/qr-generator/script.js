document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const formTitle = document.getElementById('form-title');
    const inputContainer = document.getElementById('input-container');
    const generateBtn = document.getElementById('generate-btn');

    const qrPlaceholder = document.getElementById('qr-placeholder');
    const qrResultContainer = document.getElementById('qr-result-container');
    const qrOutput = document.getElementById('qr-output');

    const downloadBtn = document.getElementById('download-btn');
    const pdfBtn = document.getElementById('pdf-btn');
    const printBtn = document.getElementById('print-btn');

    let currentType = 'website';
    let qrCodeObj = null;

    // Configuración de Plantillas
    const templates = {
        website: {
            title: 'Generar QR para Sitio Web',
            inputs: `
                <div class="input-group">
                    <label>URL del Sitio Web</label>
                    <div class="input-wrapper">
                        <i class="fa-solid fa-link"></i>
                        <input type="url" id="data-url" placeholder="https://ejemplo.com">
                    </div>
                </div>
            `
        },
        instagram: {
            title: 'Generar QR para Instagram',
            inputs: `
                <div class="input-group">
                    <label>Nombre de Usuario</label>
                    <div class="input-wrapper">
                        <i class="fa-brands fa-instagram"></i>
                        <input type="text" id="data-username" placeholder="@usuario">
                    </div>
                </div>
            `
        },
        facebook: {
            title: 'Generar QR para Facebook',
            inputs: `
                <div class="input-group">
                    <label>URL del Perfil o Página</label>
                    <div class="input-wrapper">
                        <i class="fa-brands fa-facebook-f"></i>
                        <input type="url" id="data-fb" placeholder="https://facebook.com/tu-pagina">
                    </div>
                </div>
            `
        },
        whatsapp: {
            title: 'Generar QR para WhatsApp',
            inputs: `
                <div class="input-group">
                    <label>Número de Celular (con código de país)</label>
                    <div class="input-wrapper">
                        <i class="fa-brands fa-whatsapp"></i>
                        <input type="tel" id="data-phone" placeholder="+54 9 11 1234 5678">
                    </div>
                </div>
                <div class="input-group">
                    <label>Mensaje (Opcional)</label>
                    <div class="input-wrapper">
                        <i class="fa-regular fa-comment-dots"></i>
                        <input type="text" id="data-msg" placeholder="Hola, quiero más información...">
                    </div>
                </div>
            `
        },
        phone: {
            title: 'Generar QR para Llamar',
            inputs: `
                <div class="input-group">
                    <label>Número de Celular</label>
                    <div class="input-wrapper">
                        <i class="fa-solid fa-mobile-screen"></i>
                        <input type="tel" id="data-call" placeholder="+1 234 567 890">
                    </div>
                </div>
            `
        }
    };

    // Cambiar Pestañas
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            currentType = item.dataset.type;
            updateForm();
            resetQR();
        });
    });

    function updateForm() {
        const template = templates[currentType];
        formTitle.textContent = template.title;
        inputContainer.innerHTML = template.inputs;

        // Animación de entrada
        const inputs = inputContainer.querySelectorAll('.input-group');
        inputs.forEach((input, index) => {
            input.style.opacity = '0';
            input.style.transform = 'translateY(10px)';
            input.style.transition = `all 0.3s ease ${index * 0.1}s`;
            setTimeout(() => {
                input.style.opacity = '1';
                input.style.transform = 'translateY(0)';
            }, 50);
        });
    }

    function resetQR() {
        qrResultContainer.style.display = 'none';
        qrPlaceholder.style.display = 'flex';
        qrOutput.innerHTML = '';
    }

    function generateQR() {
        let data = '';

        // Recolectar datos según el tipo
        if (currentType === 'website') {
            const url = document.getElementById('data-url').value;
            if (!url) return alert('Por favor ingresa una URL');
            data = url;
        } else if (currentType === 'instagram') {
            const username = document.getElementById('data-username').value;
            if (!username) return alert('Por favor ingresa un usuario');
            data = `https://instagram.com/${username.replace('@', '')}`;
        } else if (currentType === 'facebook') {
            const fbUrl = document.getElementById('data-fb').value;
            if (!fbUrl) return alert('Por favor ingresa una URL de Facebook');
            data = fbUrl;
        } else if (currentType === 'whatsapp') {
            const phone = document.getElementById('data-phone').value.replace(/\D/g, '');
            const msg = document.getElementById('data-msg').value;
            if (!phone) return alert('Por favor ingresa un número válido');
            data = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
        } else if (currentType === 'phone') {
            const call = document.getElementById('data-call').value;
            if (!call) return alert('Por favor ingresa un número');
            data = `tel:${call}`;
        }

        // Limpiar anterior
        qrOutput.innerHTML = '';

        // Generar QR
        qrCodeObj = new QRCode(qrOutput, {
            text: data,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // Mostrar resultado
        qrPlaceholder.style.display = 'none';
        qrResultContainer.style.display = 'flex';
    }

    generateBtn.addEventListener('click', generateQR);

    // --- Funciones de Descarga ---

    // 1. Descargar PNG (Canvas para asegurar fondo blanco)
    downloadBtn.addEventListener('click', () => {
        const img = qrOutput.querySelector('img');
        if (img && img.src) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const image = new Image();

            image.onload = function () {
                canvas.width = image.width;
                canvas.height = image.height;
                // Fondo blanco
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, 0, 0);

                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `qr-${currentType}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
            image.src = img.src;
        }
    });

    // 2. Generar PDF (Vista de impresión limpia)
    pdfBtn.addEventListener('click', () => {
        const img = qrOutput.querySelector('img');
        if (img && img.src) {
            const win = window.open('', '_blank');
            win.document.write(`
                <html>
                <head>
                    <title>QR Code PDF</title>
                    <style>
                        body { 
                            display: flex; 
                            flex-direction: column;
                            justify-content: center; 
                            align-items: center; 
                            height: 100vh; 
                            margin: 0; 
                            font-family: sans-serif;
                        }
                        h1 { margin-bottom: 20px; font-size: 24px; }
                        img { max-width: 300px; height: auto; border: 1px solid #ccc; }
                        .footer { margin-top: 20px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <h1>Tu Código QR</h1>
                    <img src="${img.src}" />
                    <div class="footer">Generado por QR Gen Premium</div>
                    <script>
                        window.onload = function() {
                            window.print();
                            // window.close(); // Opcional: cerrar después de imprimir
                        }
                    </script>
                </body>
                </html>
            `);
            win.document.close();
        }
    });

    // 3. Imprimir Directamente
    printBtn.addEventListener('click', () => {
        const img = qrOutput.querySelector('img');
        if (img && img.src) {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.write('<html><head><title>Imprimir QR</title>');
            printWindow.document.write('</head><body style="display:flex;justify-content:center;align-items:center;height:100vh;">');
            printWindow.document.write(`<img src="${img.src}" style="width:300px;height:300px;"/>`);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
        }
    });

    // Inicializar
    updateForm();
});
