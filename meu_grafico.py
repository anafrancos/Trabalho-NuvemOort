import matplotlib.pyplot as plt
import numpy as np

# Criar figura MAIOR para caber tudo
fig, ax = plt.subplots(figsize=(12, 12))
ax.set_facecolor('#0a0a2a')
fig.patch.set_facecolor('#0a0a2a')

# Desenhar anéis concêntricos (com raios MENORES)
aneis = [
    (1, 'Sol', '#ffaa44', 1.5),
    (3, 'Planetas Rochosos', '#44ff44', 1),
    (7, 'Planetas Gasosos', '#44aaff', 1),
    (20, 'Cinturão de Kuiper', '#ff66cc', 1.5),
    (45, 'NUVEM DE OORT', '#aa66ff', 2),
]

for raio, nome, cor, largura in aneis:
    circulo = plt.Circle((0, 0), raio, fill=False, edgecolor=cor, linewidth=largura, alpha=0.7)
    ax.add_patch(circulo)
    # Colocar textos DENTRO do gráfico, ajustando a posição
    if 'NUVEM' in nome:
        ax.text(0, raio + 3, nome, color=cor, fontsize=11, ha='center', fontweight='bold')
    elif 'Sol' in nome:
        ax.text(0, raio - 1.5, nome, color=cor, fontsize=10, ha='center')
    else:
        ax.text(0, raio + 1.2, nome, color=cor, fontsize=9, ha='center')

# Ponto central (Sol)
ax.plot(0, 0, 'o', color='#ffaa44', markersize=18, zorder=10)
ax.text(0, -2, 'SOL', color='#ffaa44', fontsize=10, ha='center', fontweight='bold')

# Ajustar limites para caber TUDO (mais espaço)
ax.set_xlim(-55, 55)
ax.set_ylim(-55, 55)
ax.set_aspect('equal')

# Título
ax.set_title('NUVEM DE OORT\nSistema Solar visto de cima', 
             color='white', fontsize=16, fontweight='bold', pad=20)

# Grades e estilo
ax.grid(alpha=0.15, color='white')
ax.set_xlabel('Distância (UA)', color='white', fontsize=10)
ax.set_ylabel('Distância (UA)', color='white', fontsize=10)
ax.tick_params(colors='white', labelsize=8)

# Legenda pequena
legend_elements = [
    plt.Line2D([0], [0], color='#ffaa44', lw=3, label='Sol'),
    plt.Line2D([0], [0], color='#44ff44', lw=3, label='Planetas Rochosos'),
    plt.Line2D([0], [0], color='#44aaff', lw=3, label='Planetas Gasosos'),
    plt.Line2D([0], [0], color='#ff66cc', lw=3, label='Cinturão de Kuiper'),
    plt.Line2D([0], [0], color='#aa66ff', lw=3, label='Nuvem de Oort'),
]
ax.legend(handles=legend_elements, loc='upper right', facecolor='#1a1a3a', 
          edgecolor='white', labelcolor='white', fontsize=8)

plt.tight_layout()
plt.savefig('nuvem_anels.png', dpi=150, facecolor='#0a0a2a')
plt.show()