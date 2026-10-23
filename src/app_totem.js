/**
 * src/app_totem.js
 * Lógica en tiempo real para la App del Tótem Publicitario (Ranking de Empresas con Partículas)
 */

import { db } from './services/api.js';
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('totemRoot');
    
    root.innerHTML = `
        <div class="brand-header" style="justify-content: center;">
            <img src="src/images/logoAngloamerica_bn.svg" alt="Anglo American" class="logo-anglo" style="height: 32px;">
        </div>
        
        <header class="totem-header">
            <p class="totem-subtitle">DÍA GLOBAL DE LA SEGURIDAD</p>
            <h1 class="totem-title">RANKING DE EMPRESAS</h1>
        </header>
        
        <div class="ranking-container" id="rankingList">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--color-cyan-glow); font-weight: 900;">
                <div class="spinner" style="margin-bottom: 10px;"></div>
                <span>CONECTANDO EN TIEMPO REAL...</span>
            </div>
        </div>
        
        <footer class="totem-footer">
            <div class="qr-box">
                <img src="src/images/QR_S26.jpg" alt="QR Registro" class="qr-image">
            </div>
            <div class="qr-instructions">
                <div class="qr-title">¡ESCANEA Y REGÍSTRATE!</div>
                <div class="qr-desc">Abre la cámara de tu celular, escanea el código QR y participa para sumar puntos a tu empresa.</div>
            </div>
        </footer>
    `;

    const rankingList = document.getElementById('rankingList');
    let previousTopCompany = null;

    onSnapshot(collection(db, "registros"), (snapshot) => {
        const companyCounts = {};

        snapshot.forEach((doc) => {
            const data = doc.data();
            const empresa = data.empresa ? data.empresa.toUpperCase().trim() : "OTRAS";
            companyCounts[empresa] = (companyCounts[empresa] || 0) + 1;
        });

        const sortedRanking = Object.entries(companyCounts)
            .map(([company, count]) => ({ company, count }))
            .sort((a, b) => b.count - a.count);

        if (sortedRanking.length === 0) {
            rankingList.innerHTML = `
                <div style="text-align: center; color: var(--color-text-muted); margin-top: auto; margin-bottom: auto; font-weight: bold;">
                    ¡Sé el primero en registrarte escaneando el código QR de abajo!
                </div>
            `;
            return;
        }

        const currentTopCompany = sortedRanking[0].company;
        const isLeaderChanged = previousTopCompany && previousTopCompany !== currentTopCompany;
        previousTopCompany = currentTopCompany;

        rankingList.innerHTML = sortedRanking.map((item, index) => {
            const rank = index + 1;
            let rankClass = '';
            let medal = `#${rank}`;

            if (rank === 1) { rankClass = 'rank-1'; medal = '👑'; }
            else if (rank === 2) { rankClass = 'rank-2'; medal = '2°'; }
            else if (rank === 3) { rankClass = 'rank-3'; medal = '3°'; }

            const pulseEffect = (rank === 1 && isLeaderChanged) ? 'updated-pulse' : '';

            return `
                <div class="ranking-row ${rankClass} ${pulseEffect}" id="row-${rank}">
                    <div class="rank-info">
                        <div class="rank-badge">${medal}</div>
                        <div class="company-name" title="${item.company}">${item.company}</div>
                    </div>
                    <div class="company-score">
                        ${item.count} <span style="font-size: 11px; font-weight: normal; opacity: 0.8;">reg.</span>
                    </div>
                </div>
            `;
        }).join('');

        // Generar partículas de tesoro dinámicamente alrededor de la tarjeta del 1er lugar
        const firstPlaceRow = document.getElementById('row-1');
        if (firstPlaceRow) {
            // Limpiar partículas previas para evitar acumulación
            firstPlaceRow.querySelectorAll('.treasure-particle').forEach(p => p.remove());

            // Crear 6 partículas flotantes con retardos y posiciones aleatorias
            for (let i = 0; i < 6; i++) {
                const particle = document.createElement('div');
                particle.className = 'treasure-particle';
                
                const randomX = Math.random() * 90 + 5; // Posición horizontal en %
                const randomDelay = Math.random() * 1.5;   // Retardo de animación
                const randomDuration = Math.random() * 1 + 1.2; // Duración variable

                particle.style.left = `${randomX}%`;
                particle.style.bottom = `${Math.random() * 10}%`;
                particle.style.animationDelay = `${randomDelay}s`;
                particle.style.animationDuration = `${randomDuration}s`;

                firstPlaceRow.appendChild(particle);
            }
        }

    }, (error) => {
        console.error("Error al escuchar Firebase en tiempo real:", error);
        rankingList.innerHTML = `
            <div style="text-align: center; color: var(--color-danger); margin-top: auto; margin-bottom: auto; font-weight: bold;">
                ⚠️ Error de conexión con el servidor en tiempo real.
            </div>
        `;
    });
});