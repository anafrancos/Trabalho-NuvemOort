import math

# Distâncias reais (em UA)
DISTANCIAS_UA = {
    "Sol → Terra": 1,
    "Sol → Netuno": 30,
    "Sol → Cinturão de Kuiper (fim)": 50,
    "Sol → Nuvem Oort (borda interna)": 2000,
    "Sol → Nuvem Oort (borda externa)": 100000
}

# 1 UA em km
UA_KM = 149597870.7  # ≈ 150 milhões km

# Velocidade da luz em km/s
VELOCIDADE_LUZ_KMS = 299792.458  # km/s

# FUNÇÕES DE CÁLCULO
def ua_para_km(ua):
    """Converte UA para quilômetros"""
    return ua * UA_KM

def tempo_luz(ua):
    """Calcula o tempo que a luz leva para percorrer a distância (em horas/dias/anos)"""
    distancia_km = ua_para_km(ua)
    segundos = distancia_km / VELOCIDADE_LUZ_KMS
    
    # Converte segundos em uma unidade de tempo mais fácil de entender (segundos → minutos → horas → dias → anos).
    if segundos < 60:
        return f"{segundos:.1f} segundos"
    elif segundos < 3600:
        return f"{segundos/60:.1f} minutos"
    elif segundos < 86400:
        return f"{segundos/3600:.1f} horas"
    elif segundos < 31536000:
        return f"{segundos/86400:.1f} dias"
    else:
        return f"{segundos/31536000:.2f} anos"

def escala_mesa_jantar(sol_cm=2.5):
    """
    Calcula as distâncias em escala onde o Sol tem 2,5 cm de diâmetro
    Retorna as distâncias em metros
    """
    # Diâmetro real do Sol em km ≈ 1.392.700 km
    diametro_sol_real_km = 1392700
    
    # Fator de escala: tamanho real (km) / tamanho modelo (cm)
    # Primeiro convertemos o tamanho do modelo para km (2.5 cm = 0.000025 km)
    tamanho_modelo_km = sol_cm / 100 / 1000  # cm → m → km (2.5 cm = 0.025 m = 0.000025 km)
    
    fator_escala = diametro_sol_real_km / tamanho_modelo_km
    
    # Para cada distância, calculamos a distância no modelo (Pega cada distância (Terra, Netuno, Nuvem de Oort) e calcula qual seria a distância no modelo reduzido.)
    resultados = {}
    for nome, ua in DISTANCIAS_UA.items():
        distancia_real_km = ua_para_km(ua)
        distancia_modelo_m = (distancia_real_km / fator_escala)  # em metros
        resultados[nome] = distancia_modelo_m
    
    return resultados, fator_escala

def escala_plutao_1m():
    """
    Escala onde Plutão está a 1 metro do Sol
    Distância real de Plutão ≈ 39,5 UA
    """
    distancia_plutao_real_ua = 39.5  # UA
    distancia_plutao_modelo_m = 1.0  # 1 metro
    
    # Fator de escala: 1 metro no modelo = 39,5 UA no real
    # Ou seja: 1 m → 39,5 UA
    ua_por_metro = distancia_plutao_real_ua / distancia_plutao_modelo_m
    
    resultados = {}
    for nome, ua in DISTANCIAS_UA.items():
        distancia_modelo_m = ua / ua_por_metro
        resultados[nome] = distancia_modelo_m
    
    return resultados, ua_por_metro

# RESULTADOS

print("DISTÂNCIAS NO SISTEMA SOLAR")

print("\nCONVERSÕES DE UA PARA QUILÔMETROS:\n")
for nome, ua in DISTANCIAS_UA.items():
    km = ua_para_km(ua)
    print(f"  {nome:35} → {ua:>8,} UA → {km:>15,.0f} km")

print("TEMPO QUE A LUZ LEVA PARA PERCORRER")

print("\nVELOCIDADE DA LUZ = 299.792 km/s\n")
for nome, ua in DISTANCIAS_UA.items():
    tempo = tempo_luz(ua)
    print(f"  {nome:35} → {ua:>8,} UA → {tempo}")

print("ESCALA 1: MESA DE JANTAR")
print("(Sol do tamanho de uma bola de pingue-pongue: 2,5 cm)")

resultados_mesa, fator = escala_mesa_jantar(2.5)

print(f"\nFator de escala: 1 cm no modelo = {fator/100000:.2e} km reais\n")
print("  Neste modelo, as distâncias seriam:\n")

for nome, distancia_m in resultados_mesa.items():
    if distancia_m < 1:
        print(f"  {nome:35} → {distancia_m*100:.1f} cm")
    elif distancia_m < 1000:
        print(f"  {nome:35} → {distancia_m:.1f} metros")
    else:
        print(f"  {nome:35} → {distancia_m/1000:.2f} km")

print("ESCALA 2: PLUTÃO A 1 METRO DO SOL")

resultados_plutao, fator_plutao = escala_plutao_1m()

print(f"\nFator de escala: 1 metro no modelo = {1/fator_plutao:.2f} UA no real")
print(f"Ou seja: a cada 1 metro no modelo, viajamos {1/fator_plutao:.2f} UA no espaço real\n")
print("Neste modelo, as distâncias seriam:\n")

for nome, distancia_m in resultados_plutao.items():
    if distancia_m < 1:
        print(f"  {nome:35} → {distancia_m*100:.1f} cm")
    else:
        print(f"  {nome:35} → {distancia_m:.1f} metros")

print("RESUMO DOS RESULTADOS")

print(f"""
TERRA (1 UA)                                                           
      → Distância: {ua_para_km(1):.0f} km                                          
      → Luz leva: {tempo_luz(1)}                                            
      → Na mesa de jantar (Sol = 2,5 cm): {resultados_mesa['Sol → Terra']*100:.1f} cm do Sol         
      → Na escala de Plutão (Plutão = 1 m): {resultados_plutao['Sol → Terra']*100:.1f} cm do Sol          
                                                                              
NETUNO (30 UA)                                                         
      → Distância: {ua_para_km(30):.0f} km                                       
      → Luz leva: {tempo_luz(30)}                                           
      → Na mesa de jantar: {resultados_mesa['Sol → Netuno']:.1f} metros do Sol                         
      → Na escala de Plutão: {resultados_plutao['Sol → Netuno']*100:.1f} cm do Sol                        
                                                                              
NUVEM OORT - BORDA INTERNA (2.000 UA)                                  
      → Distância: {ua_para_km(2000):.0f} km                                     
      → Luz leva: {tempo_luz(2000)}                                         
      → Na mesa de jantar: {resultados_mesa['Sol → Nuvem Oort (borda interna)']:.1f} METROS do Sol                 
      → Na escala de Plutão: {resultados_plutao['Sol → Nuvem Oort (borda interna)']:.1f} METROS do Sol                
                                                                              
NUVEM OORT - BORDA EXTERNA (100.000 UA)                                
      → Distância: {ua_para_km(100000):.0f} km                                  
      → Luz leva: {tempo_luz(100000)}                                       
      → Na mesa de jantar: {resultados_mesa['Sol → Nuvem Oort (borda externa)']/1000:.2f} KM do Sol                  
      → Na escala de Plutão: {resultados_plutao['Sol → Nuvem Oort (borda externa)']:.1f} METROS do Sol                
""")