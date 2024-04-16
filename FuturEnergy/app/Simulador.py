import tkinter as tk
from tkinter import messagebox

# Função para simular o custo mensal com a tarifa da Goldenergy
def simular():
    try:
        custo_atual = float(entrada_custo_atual.get())  # Custo mensal atual (€)
        consumo_mensal = float(entrada_consumo_mensal.get())  # Consumo mensal (kWh)

        # Tarifa da Goldenergy para eletricidade (custo do kWh)
        tarifa_electricidade_goldenergy = 0.1599  # €/kWh

        # Cálculo do custo simulado com a Goldenergy
        custo_simulado = consumo_mensal * tarifa_electricidade_goldenergy

        # Exibição dos resultados
        messagebox.showinfo("Resultado", f"Custo simulado com a Goldenergy: €{custo_simulado:.2f}")
    except ValueError:
        messagebox.showerror("Erro", "Por favor, insira valores válidos.")


# Cria a janela principal
root = tk.Tk()
root.title("Simulador Goldenergy")

# Rótulos e entradas para os campos de preenchimento
tk.Label(root, text="Valor KW/H (€):").grid(row=0, column=0)
entrada_custo_atual = tk.Entry(root)
entrada_custo_atual.grid(row=0, column=1)

tk.Label(root, text="Consumo Mensal (kW):").grid(row=1, column=0)
entrada_consumo_mensal = tk.Entry(root)
entrada_consumo_mensal.grid(row=1, column=1)

# Botão para realizar a simulação
botao_simular = tk.Button(root, text="Simular", command=simular)
botao_simular.grid(row=2, columnspan=2)

# Loop principal da aplicação
root.mainloop()
