#!/bin/bash
# Script de renomeação: Agende Mais → DaTempo
# Executar da raiz do projeto

echo "🔄 Renomeando 'Agende Mais' para 'DaTempo'..."

# Substituir em arquivos TypeScript/TSX
find src/app -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's/Agende Mais/DaTempo/g' {} +
find src/lib -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's/Agende Mais/DaTempo/g' {} +
find src/components -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's/Agende Mais/DaTempo/g' {} +

# Substituir variações
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's/AgendeMais/DaTempo/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's/agendemais/datempo/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's/AGENDEMAIS/DATEMPO/g' {} +

# Substituir ZapAgenda
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's/ZapAgenda/DaTempo/g' {} +
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's/zapagenda/datempo/g' {} +

echo "✅ Renomeação concluída!"
echo ""
echo "📝 Arquivos modificados:"
git diff --name-only | head -20
