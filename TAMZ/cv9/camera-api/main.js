import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

// NASTAVENÍ: Vložte své údaje z Imagga Dashboard
const API_KEY = 'acc_d32d57a4acdf3da';
const API_SECRET = 'da65317726049d1cf599dc9597b28a13';
const authHeader = 'Basic ' + btoa(API_KEY + ':' + API_SECRET);

// CORS proxy base URL
const CORS_PROXY = 'https://corsproxy.io/?';

let selectedMode = 'tags-v2';
document.getElementById('modeSelector').addEventListener('ionChange', (e) => {
    selectedMode = e.detail.value;
});

function playSimpleSound() {
            const audio = new Audio('assets/ding.mp3');
            audio.play();
        }

document.getElementById('btnFoto').addEventListener('click', async () => {
    try {
        // 1. Získání fotky (Kamera nebo Galerie)
        const photo = await Camera.getPhoto({
            quality: 90,
            resultType: CameraResultType.Uri,
            source: CameraSource.Prompt
        });

        // 2. Převod na data pro odeslání (Blob)
        const response = await fetch(photo.webPath);
        const blob = await response.blob();
        
        const formData = new FormData();
        formData.append('image', blob, 'foto.jpg');

        // Display uploaded image
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('uploadedImage').src = e.target.result;
            document.getElementById('imageCard').style.display = 'block';
        };
        reader.readAsDataURL(blob);

        // 3. Odeslání na Imagga API podle vybraného módu
        let apiUrl;
        let isImageResponse = false;

        if (selectedMode === 'tags-v2') {
            apiUrl = CORS_PROXY + 'https://api.imagga.com/v2/tags';
        } else if (selectedMode === 'tags-v3') {
            apiUrl = CORS_PROXY + 'https://api.imagga.com/v3/tags';
        } else if (selectedMode === 'colors') {
            apiUrl = CORS_PROXY + 'https://api.imagga.com/v2/colors';
        } else if (selectedMode === 'ocr') {
            apiUrl = CORS_PROXY + 'https://api.imagga.com/v2/text';
        }

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Authorization': authHeader },
            body: formData
        });

        const data = await apiResponse.json();
        console.log('API Response:', data);

         
        const resultsContainer = document.getElementById('vysledky');
        const resultsCard = document.getElementById('resultsCard');
        resultsContainer.innerHTML = '';

        // Zobrazení výsledků podle módu
        if (selectedMode === 'tags-v2' && data.result && data.result.tags) {
            data.result.tags.forEach(t => {
                if (t.confidence > 40) {
                    resultsContainer.innerHTML += `<ion-chip><ion-label>${t.tag.en} - ${Math.round(t.confidence)}%</ion-label></ion-chip>`;
                }
            });
        } else if (selectedMode === 'tags-v3') {
                let html = '';
                
                // caption if available
                if (data.result && data.result.caption) {
                    html += `<div style="margin-bottom: 12px; font-style: italic; color: #666;"><strong>Caption:</strong> ${data.result.caption}</div>`;
                }
                
                // tag from each category
                if (data.result && data.result.tags) {
                    const tags = data.result.tags;
                    const categories = ['colors', 'extended', 'mood', 'objects', 'scene'];
                    
                    categories.forEach(category => {
                        if (tags[category] && Array.isArray(tags[category])) {
                            tags[category].forEach(tag => {
                                html += `<ion-chip><ion-label>${tag}</ion-label></ion-chip>`;
                            });
                        }
                    });
                }
                
                resultsContainer.innerHTML = html;
            } else if (selectedMode === 'colors') {
               let html = '';
                
                if (data.result && data.result.colors) {
                    const colors = data.result.colors;
                    
                    // maian image colors
                    if (colors.image_colors && Array.isArray(colors.image_colors)) {
                        html += '<div style="margin-bottom: 16px;"><strong>Overall Colors:</strong></div>';
                        colors.image_colors.forEach(color => {
                            html += `
                                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                    <div style="width: 40px; height: 40px; background-color: ${color.html_code}; border-radius: 4px; border: 1px solid #ccc; margin-right: 12px;"></div>
                                    <div style="flex: 1;">
                                        <div><strong>${color.closest_palette_color}</strong></div>
                                        <div style="font-size: 12px; color: #666;">${color.html_code} • ${Math.round(color.percent * 10) / 10}%</div>
                                    </div>
                                </div>
                            `;
                        });
                    }
                    
                    // foreground colors
                    if (colors.foreground_colors && Array.isArray(colors.foreground_colors)) {
                        html += '<div style="margin-top: 20px; margin-bottom: 16px;"><strong>Foreground Colors:</strong></div>';
                        colors.foreground_colors.forEach(color => {
                            html += `
                                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                    <div style="width: 40px; height: 40px; background-color: ${color.html_code}; border-radius: 4px; border: 1px solid #ccc; margin-right: 12px;"></div>
                                    <div style="flex: 1;">
                                        <div><strong>${color.closest_palette_color}</strong></div>
                                        <div style="font-size: 12px; color: #666;">${color.html_code} • ${Math.round(color.percent * 10) / 10}%</div>
                                    </div>
                                </div>
                            `;
                        });
                    }
                    
                    // background colors
                    if (colors.background_colors && Array.isArray(colors.background_colors)) {
                        html += '<div style="margin-top: 20px; margin-bottom: 16px;"><strong>Background Colors:</strong></div>';
                        colors.background_colors.forEach(color => {
                            html += `
                                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                    <div style="width: 40px; height: 40px; background-color: ${color.html_code}; border-radius: 4px; border: 1px solid #ccc; margin-right: 12px;"></div>
                                    <div style="flex: 1;">
                                        <div><strong>${color.closest_palette_color}</strong></div>
                                        <div style="font-size: 12px; color: #666;">${color.html_code} • ${Math.round(color.percent * 10) / 10}%</div>
                                    </div>
                                </div>
                            `;
                        });
                    }
                }
                
                resultsContainer.innerHTML = html || '<p>No colors detected</p>';
            } else if (selectedMode === 'ocr') {
                let html = '';
                
                if (data.result && Array.isArray(data.result.text)) {
                    data.result.text.forEach((textBlock, index) => {
                        if (textBlock && textBlock.data) {
                            const coords = textBlock.coordinates || {};
                            html += `
                                <ion-card style="margin: 8px 0;">
                                    <ion-card-header>
                                        <ion-card-subtitle>Text Block ${index + 1}</ion-card-subtitle>
                                    </ion-card-header>
                                    <ion-card-content>
                                        <p>${textBlock.data.replace(/\n/g, '<br>')}</p>
                                        <ion-note style="font-size: 12px; margin-top: 8px;">
                                            Position: (${coords.xmin}, ${coords.ymin}) - ${coords.width}×${coords.height}px
                                        </ion-note>
                                    </ion-card-content>
                                </ion-card>
                            `;
                        }
                    });
                }
                
                resultsContainer.innerHTML = html || '<p>No text detected</p>';
            } else {
                resultsContainer.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
            }

        resultsCard.style.display = 'block';

        // play success sound
        playSimpleSound();

    } catch (err) {
        console.error('Chyba:', err);
        alert('Něco se nepovedlo. Zkontrolujte konzoli.');
    }
});