import { createContext, useContext, useMemo, useState } from 'react';

const AddressContext = createContext();

const direccionesIniciales = [
  {
    id: 1,
    calle: 'Av. Corrientes',
    numero: '1234',
    piso: '8B',
    ciudad: 'Buenos Aires',
    provincia: 'CABA',
    codigoPostal: '1043',
    referencia: 'Portero eléctrico 8B',
    principal: true,
  },
];

const formatearDireccion = (direccion) => {
  const partes = [
    `${direccion.calle} ${direccion.numero}`.trim(),
    direccion.piso ? `Piso ${direccion.piso}` : '',
    direccion.ciudad,
    direccion.provincia,
    direccion.codigoPostal ? `CP ${direccion.codigoPostal}` : '',
  ].filter(Boolean);

  return partes.join(' · ');
};

export const AddressProvider = ({ children }) => {
  const [direcciones, setDirecciones] = useState(direccionesIniciales);

  const agregarDireccion = (direccion) => {
    setDirecciones((prev) => {
      const nuevaDireccion = {
        ...direccion,
        id: Date.now(),
        principal: prev.length === 0,
      };

      return [...prev, nuevaDireccion];
    });
  };

  const establecerPrincipal = (id) => {
    setDirecciones((prev) => prev.map((direccion) => ({
      ...direccion,
      principal: direccion.id === id,
    })));
  };

  const direccionPrincipal = useMemo(
    () => direcciones.find((direccion) => direccion.principal) || direcciones[0] || null,
    [direcciones]
  );

  const direccionesFormateadas = useMemo(
    () => direcciones.map((direccion) => ({
      ...direccion,
      etiqueta: formatearDireccion(direccion),
    })),
    [direcciones]
  );

  return (
    <AddressContext.Provider value={{
      direcciones,
      direccionesFormateadas,
      direccionPrincipal,
      agregarDireccion,
      establecerPrincipal,
      formatearDireccion,
    }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddresses = () => useContext(AddressContext);
