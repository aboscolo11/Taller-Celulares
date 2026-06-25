// src/firebase.js
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc, 
  doc, 
  updateDoc,
  onSnapshot
} from "firebase/firestore";

// 🔥 CARGAR CONFIGURACIÓN DE FIREBASE DESDE VARIABLES DE ENTORNO
// Si no están disponibles en producción, usa los valores predeterminados del proyecto.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA2xOQia5SHnSinbYTJG0k1TRji-wKyLds",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "taller-celulares-a6aa1.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "taller-celulares-a6aa1",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "taller-celulares-a6aa1.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "422095801321",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:422095801321:web:949fdf6dae363c8263d978"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📌 Nombre de la colección en Firestore
const COLECCION = "reparaciones";

// ============ FUNCIONES PARA TU TALLER ============

// ✅ Guardar una nueva reparación
export const guardarReparacion = async (datos) => {
  try {
    const docRef = await addDoc(collection(db, COLECCION), {
      ...datos,
      fechaIngreso: new Date().toISOString(),
      estado: "Pendiente"
    });
    console.log("✅ Reparación guardada con ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error al guardar:", error);
    throw error;
  }
};

// 📋 Obtener todas las reparaciones
export const obtenerReparaciones = async () => {
  try {
    const q = query(collection(db, COLECCION), orderBy("fechaIngreso", "desc"));
    const querySnapshot = await getDocs(q);
    const reparaciones = [];
    querySnapshot.forEach((doc) => {
      reparaciones.push({ id: doc.id, ...doc.data() });
    });
    return reparaciones;
  } catch (error) {
    console.error("❌ Error al obtener:", error);
    throw error;
  }
};

// 🗑️ Eliminar una reparación
export const eliminarReparacion = async (id) => {
  try {
    await deleteDoc(doc(db, COLECCION, id));
    console.log("✅ Reparación eliminada:", id);
  } catch (error) {
    console.error("❌ Error al eliminar:", error);
    throw error;
  }
};

// ✏️ Actualizar estado de una reparación
export const actualizarEstado = async (id, nuevoEstado) => {
  try {
    const docRef = doc(db, COLECCION, id);
    await updateDoc(docRef, { estado: nuevoEstado });
    console.log("✅ Estado actualizado:", id);
  } catch (error) {
    console.error("❌ Error al actualizar:", error);
    throw error;
  }
};

// 🔄 Escuchar cambios en tiempo real (opcional)
export const escucharReparaciones = (callback) => {
  const q = query(collection(db, COLECCION), orderBy("fechaIngreso", "desc"));
  return onSnapshot(q, (snapshot) => {
    const reparaciones = [];
    snapshot.forEach((doc) => {
      reparaciones.push({ id: doc.id, ...doc.data() });
    });
    callback(reparaciones);
  });
};

export default db;