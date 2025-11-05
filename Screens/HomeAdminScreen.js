import React from "react";
import { View, Text, StyleSheet, ImageBackground, ScrollView } from "react-native";

export default function HomeAdminScreen() {
  
  // Datos simulados
  const total = 120;
  const resueltas = 80;
  const enProceso = 25;
  const pendientes = 15;
  const tiempoPromedio = "3.2 días";

  const porcentajeResueltas = Math.round((resueltas / total) * 100);
  const porcentajeProceso = Math.round((enProceso / total) * 100);
  const porcentajePendientes = Math.round((pendientes / total) * 100);

  const Barra = ({ porcentaje, color }) => (
    <View style={styles.barraCont}>
      <View style={[styles.barra, { width: `${porcentaje}%`, backgroundColor: color }]} />
      <Text style={styles.barraTexto}>{porcentaje}%</Text>
    </View>
  );

  return (
    
    <View style={styles.container}>
    <ScrollView 
      showsVerticalScrollIndicator={false}
    
    >
      <Text style={styles.titulo}>Dashboard Administrador</Text>

      {/* KPIs */}
      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.num}>{total}</Text>
          <Text style={styles.label}>Total Peticiones</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.num}>{resueltas}</Text>
          <Text style={styles.label}>Resueltas</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.num}>{enProceso}</Text>
          <Text style={styles.label}>En Proceso</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.num}>{pendientes}</Text>
          <Text style={styles.label}>Pendientes</Text>
        </View>
      </View>

      <View style={styles.cardLarge}>
        <Text style={styles.num}>{tiempoPromedio}</Text>
        <Text style={styles.label}>Tiempo promedio de resolución</Text>
      </View>

      {/* Gráficos simples */}
      <Text style={styles.subtitle}>Proporción de estados</Text>

      <Text style={styles.chartLabel}>Resueltas</Text>
      <Barra porcentaje={porcentajeResueltas} color="#06d6a0" />

      <Text style={styles.chartLabel}>En Proceso</Text>
      <Barra porcentaje={porcentajeProceso} color="#4dabff" />

      <Text style={styles.chartLabel}>Pendientes</Text>
      <Barra porcentaje={porcentajePendientes} color="#ffbe0b" />

      {/* Sección ML futura */}
      <Text style={styles.subtitle}>Inteligencia Artificial (coming soon)</Text>

      <View style={styles.cardML}>
        <Text style={styles.mlTitulo}> Predicción de volumen</Text>
        <Text style={styles.mlTexto}>Modelo estimará cantidad de solicitudes futuras basada en patrones históricos.</Text>
      </View>

      <View style={styles.cardML}>
        <Text style={styles.mlTitulo}> Análisis de Sentimiento</Text>
        <Text style={styles.mlTexto}>Clasificación automática del sentimiento del alumno: positivo, neutral, negativo.</Text>
      </View>
    </ScrollView>
    </View>
   
    
    
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 15,
  },
  titulo: {
    color: "#5170ff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#1a1a1a",
    width: "48%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardLarge: {
    backgroundColor: "#1a1a1a",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  num: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    color: "#aaa",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
  subtitle: {
    color: "#fff",
    fontSize: 18,
    marginTop: 18,
    marginBottom: 8,
    fontWeight: "bold",
  },
  chartLabel: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 8,
  },
  barraCont: {
    height: 20,
    backgroundColor: "#222",
    borderRadius: 8,
    marginVertical: 4,
    justifyContent: "center",
  },
  barra: {
    height: "100%",
    borderRadius: 8,
  },
  barraTexto: {
    position: "absolute",
    alignSelf: "center",
    color: "#fff",
    fontSize: 11,
  },
  cardML: {
    backgroundColor: "#161616",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#5170ff",
  },
  mlTitulo: {
    color: "#5170ff",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  mlTexto: {
    color: "#ccc",
    fontSize: 13,
  },
});
