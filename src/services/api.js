import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDdjupsk4Wsjzo-XEYNOdTKcX6LY82-bKA",
    authDomain: "rankingempresas.firebaseapp.com",
    projectId: "rankingempresas",
    storageBucket: "rankingempresas.firebasestorage.app",
    messagingSenderId: "1043186566343",
    appId: "1:1043186566343:web:7b8864b1d7dd77b7aaeae2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const getEmpresasBase = () => {
    const custom = JSON.parse(localStorage.getItem('custom_empresas')) || [];
    const base = [
        "ABRATECH", "ACONCAGUA", "ADECCO", "ADEMIN", "AEI SRL", "ALS PERÚ SAC", "AMBIPAR", 
        "ANDIKEM", "APRECIUM", "ATILA", "ATKINSREALIS", "AUSENCO", "B & H CARDENAS S.A.C.", 
        "BORNAV SAC", "BRADKEN", "C&R", "CALCESUR SA", "CALICOM", "CATERPILLAR", "CBT", 
        "CERTIFICA", "CIME", "CMMS", "CONETEC", "CONTROLTEK", "CTM", "CYM", "CYTEC", 
        "D MARTINS", "DIMARZA", "DRILLCO", "DYMAR", "E&P TECNOLOGÍA DEL PERÚ S.A.C", 
        "ECOLAB", "ECOP", "ECOSER", "EFC", "EMERSON PERÚ SAC", "ENAEX", "ENERGOTEC S.A.C.", 
        "ENGIE ENERGÍA", "EPIROC", "EQUANS", "EQUIMAP", "ERIEZ", "FDAG", "FL SMIDTH", 
        "FLUIDTEK SRL", "FORYMEC", "FSS PERU", "FUNDICION FERROSA SAC", "GEDALIAS", 
        "GESTIONA ACTIVOS", "GLOBAL MAPPING", "GREEN GROUP", "GROWTH STEEL PERU SAC", 
        "HAGEMSA", "HAVER & BOECKER ANDINA", "HCL", "IGH PERU", "INDELAT SAC", "INDUMETSA", 
        "INNOMOTICS SAC", "INSIDEO", "INSPECTORATE", "INTERSALES", "ISUR", "JOPAL", 
        "JP PLANNING", "KAMPFER", "KNIGHT PIESOLD", "KONECRANES", "KSB PERU", "LIPLATA PERU S.A.", 
        "LIVIGUI", "LO JUSTO", "MAGMA", "MAHUSA", "MAKYL", "MAR S.A.C", "MARCO PERUANA", 
        "MORKEN PERU S.A.C", "MOVITECNICA", "NAZCA ENERGY S.A.C.", "NEUMA PERÚ", "OCA GLOBAL", 
        "PINO", "PRECISION", "PRIMAX", "PROMAP SAC", "PROTAB", "PRUP SAC", "QUALITAS S.A.", 
        "QUANTEC", "R&Q", "RCING MECÁNICA", "REDERSUR", "RELINING S.A.C.", "RELIPER", 
        "RUSSELL MINERAL EQUIPMENT S.A.", "SACRUN", "SAEG", "SCHNEIDER", "SELIN", "SEQUITECSA", 
        "SERIMAN", "SINNENS", "STANTEC", "SVENDBORG BRAKES PERU S.A.C.", "T&D ELECTRIC SAC", 
        "TECNOMINA", "TICSANI", "TRANSPORTES ZUÑIGA", "VULCO", "WCARO", "WEG", "WONG", 
        "ANGLOAMERICAN"
    ];
    const combined = [...base, ...custom].map(e => e.toUpperCase());
    return [...new Set(combined)].sort();
};

export const registerNewCompanyDynamic = (compName) => {
    const upper = compName.toUpperCase().trim();
    const custom = JSON.parse(localStorage.getItem('custom_empresas')) || [];
    if (!custom.includes(upper) && !getEmpresasBase().includes(upper)) {
        custom.push(upper);
        localStorage.setItem('custom_empresas', JSON.stringify(custom));
    }
};

export const sendToGoogleForms = (dni, company, lugar) => {
    const devSettings = JSON.parse(localStorage.getItem('dev_settings')) || { syncEnabled: true };
    if (!devSettings.syncEnabled) return;

    const googleFormUrl = "https://docs.google.com/forms/u/0/d/e/1FAIpQLScOEQGcKyg6R1vZQs1BFm3Rt4bi1GNG-dfWdu1PdmjEs_ZqxQ/formResponse";
    const formData = new FormData();
    formData.append("entry.1245377513", dni);
    formData.append("entry.1112581719", company);
    formData.append("entry.1612326917", lugar);

    fetch(googleFormUrl, { method: "POST", mode: "no-cors", body: formData })
        .catch(err => console.error("Error Google Forms:", err));
};

export const sendToFirebase = async (dni, company, lugar) => {
    const devSettings = JSON.parse(localStorage.getItem('dev_settings')) || { syncEnabled: true };
    if (!devSettings.syncEnabled) return;

    try {
        await addDoc(collection(db, "registros"), {
            dni: dni,
            empresa: company.toUpperCase(),
            lugar: lugar.toUpperCase(),
            timestamp: serverTimestamp()
        });
    } catch (e) {
        console.error("Error al registrar en Firebase:", e);
    }
};