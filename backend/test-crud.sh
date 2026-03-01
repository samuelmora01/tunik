#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Obtener token
echo "🔐 Obteniendo token de autenticación..."
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","contrasena":"123456"}' | jq -r '.data.accessToken')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
    echo -e "${RED}❌ Error al obtener token${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Token obtenido${NC}\n"

# Función para verificar respuesta
check_response() {
    local response=$1
    local operation=$2
    local ok=$(echo "$response" | jq -r '.ok')
    
    if [ "$ok" == "true" ]; then
        echo -e "${GREEN}✅ $operation - OK${NC}"
        echo "$response" | jq '{ok, msg, data: (.data | if type == "array" then length else . end)}'
    else
        echo -e "${RED}❌ $operation - FAILED${NC}"
        echo "$response" | jq '{ok, msg}'
    fi
    echo ""
}

echo "========================================="
echo "PRUEBA CRUD COMPLETO - INVENTARIO"
echo "========================================="

# ========== PRODUCTOS ==========
echo -e "\n${BLUE}📦 PRODUCTOS${NC}"

echo "1️⃣ CREATE - Crear producto"
RESPONSE=$(curl -s -X POST http://localhost:3000/api/productos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"idproveedor":8,"nombreproductos":"Test CRUD Producto","precio":50000,"cantidadexistente":10}')
check_response "$RESPONSE" "CREATE Producto"
PROD_ID=$(echo "$RESPONSE" | jq -r '.data.idproductos')

echo "2️⃣ READ - Listar todos los productos"
RESPONSE=$(curl -s http://localhost:3000/api/productos -H "Authorization: Bearer $TOKEN")
check_response "$RESPONSE" "READ Productos"

echo "3️⃣ UPDATE - Actualizar producto ID $PROD_ID"
RESPONSE=$(curl -s -X PUT http://localhost:3000/api/productos/$PROD_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombreproductos":"Test ACTUALIZADO","precio":75000}')
check_response "$RESPONSE" "UPDATE Producto"

echo "4️⃣ DELETE - Eliminar producto ID $PROD_ID"
RESPONSE=$(curl -s -X DELETE http://localhost:3000/api/productos/$PROD_ID \
  -H "Authorization: Bearer $TOKEN")
check_response "$RESPONSE" "DELETE Producto"

# ========== PROVEEDORES ==========
echo -e "\n${BLUE}🏢 PROVEEDORES${NC}"

echo "1️⃣ CREATE - Crear proveedor"
RESPONSE=$(curl -s -X POST http://localhost:3000/api/proveedores \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test CRUD Proveedor","telefono":"3001234567","correo":"test@test.com","nombreempresa":"Test SA"}')
check_response "$RESPONSE" "CREATE Proveedor"
PROV_ID=$(echo "$RESPONSE" | jq -r '.data.idproveedor')

echo "2️⃣ READ - Listar todos los proveedores"
RESPONSE=$(curl -s http://localhost:3000/api/proveedores -H "Authorization: Bearer $TOKEN")
check_response "$RESPONSE" "READ Proveedores"

echo "3️⃣ UPDATE - Actualizar proveedor ID $PROV_ID"
RESPONSE=$(curl -s -X PUT http://localhost:3000/api/proveedores/$PROV_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Proveedor ACTUALIZADO","nombreempresa":"Test ACTUALIZADO SA"}')
check_response "$RESPONSE" "UPDATE Proveedor"

echo "4️⃣ DELETE - Eliminar proveedor ID $PROV_ID"
RESPONSE=$(curl -s -X DELETE http://localhost:3000/api/proveedores/$PROV_ID \
  -H "Authorization: Bearer $TOKEN")
check_response "$RESPONSE" "DELETE Proveedor"

# ========== PEDIDOS ==========
echo -e "\n${BLUE}📋 PEDIDOS${NC}"

echo "1️⃣ CREATE - Crear pedido"
RESPONSE=$(curl -s -X POST http://localhost:3000/api/pedidos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"idproveedor":8,"fechaPedido":"2026-03-01","estado":"Pendiente"}')
check_response "$RESPONSE" "CREATE Pedido"
PED_ID=$(echo "$RESPONSE" | jq -r '.data.idpedidos')

echo "2️⃣ READ - Listar todos los pedidos"
RESPONSE=$(curl -s http://localhost:3000/api/pedidos -H "Authorization: Bearer $TOKEN")
check_response "$RESPONSE" "READ Pedidos"

echo "3️⃣ READ BY ID - Obtener pedido ID $PED_ID"
RESPONSE=$(curl -s http://localhost:3000/api/pedidos/$PED_ID -H "Authorization: Bearer $TOKEN")
check_response "$RESPONSE" "READ Pedido by ID"

echo "4️⃣ UPDATE - Actualizar pedido ID $PED_ID"
RESPONSE=$(curl -s -X PUT http://localhost:3000/api/pedidos/$PED_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"estado":"Completado"}')
check_response "$RESPONSE" "UPDATE Pedido"

echo "5️⃣ READ DETALLES - Listar todos los detalles de pedidos"
RESPONSE=$(curl -s http://localhost:3000/api/detallepedidos -H "Authorization: Bearer $TOKEN")
check_response "$RESPONSE" "READ Detalles Pedidos"

echo "6️⃣ READ DETALLES BY PEDIDO - Obtener detalles del pedido 21"
RESPONSE=$(curl -s http://localhost:3000/api/detallepedidos/pedido/21 -H "Authorization: Bearer $TOKEN")
check_response "$RESPONSE" "READ Detalles by Pedido"

echo "7️⃣ DELETE - Eliminar pedido ID $PED_ID"
RESPONSE=$(curl -s -X DELETE http://localhost:3000/api/pedidos/$PED_ID \
  -H "Authorization: Bearer $TOKEN")
check_response "$RESPONSE" "DELETE Pedido"

echo "========================================="
echo -e "${GREEN}✅ TODAS LAS PRUEBAS COMPLETADAS${NC}"
echo "========================================="
