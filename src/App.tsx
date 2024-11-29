import {
  Flex,
  Group,
  Pagination,
  ScrollArea,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { getVehiclesPerPageVehicles } from "./network/getVehiclesPerPage";

type TVehicle = {
  census_tract_2020: string;
  base_msrp: string;
  cafv_type: string;
  city: string;
  county: string;
  dol_vehicle_id: string;
  electric_range: string;
  electric_utility: string;
  ev_type: string;
  geocoded_column: string;
  legislative_district: string;
  make: string;
  model: string;
  model_year: string;
  state: string;
  vin: string;
  zip_code: string;
};

type TVehicles = {
  total_vehiculos: number;
  total_paginas: number;
  pagina_actual: number;
  tamanho_pagina: number;
  vehiculos: TVehicle[];
};

const vehicles = {
  total_vehiculos: 216773,
  total_paginas: 21678,
  pagina_actual: 2,
  tamaño_pagina: 10,
  vehiculos: [
    {
      census_tract_2020: "53033027100",
      base_msrp: "0",
      cafv_type: "Clean Alternative Fuel Vehicle Eligible",
      city: "Burien",
      county: "King",
      dol_vehicle_id: "213452795",
      electric_range: "73",
      electric_utility: "CITY OF SEATTLE - (WA)|CITY OF TACOMA - (WA)",
      ev_type: "Battery Electric Vehicle (BEV)",
      geocoded_column: "POINT (-122.3317 47.50314)",
      legislative_district: "33",
      make: "NISSAN",
      model: "LEAF",
      model_year: "2012",
      state: "WA",
      vin: "JN1AZ0CP2C",
      zip_code: "98168",
    },
    {
      census_tract_2020: "53035090902",
      base_msrp: "0",
      cafv_type: "Clean Alternative Fuel Vehicle Eligible",
      city: "Bainbridge Island",
      county: "Kitsap",
      dol_vehicle_id: "104355884",
      electric_range: "322",
      electric_utility: "PUGET SOUND ENERGY INC",
      ev_type: "Battery Electric Vehicle (BEV)",
      geocoded_column: "POINT (-122.521 47.62728)",
      legislative_district: "23",
      make: "TESLA",
      model: "MODEL 3",
      model_year: "2020",
      state: "WA",
      vin: "5YJ3E1EBXL",
      zip_code: "98110",
    },
  ],
};

const App = () => {
  const [vehiclesPerPage, setVehiclesPerPage] = useState<TVehicles>();
  const keys =
    vehiclesPerPage && vehiclesPerPage.vehiculos.length > 0
      ? Object.keys(vehicles.vehiculos[0])
      : [];

  const pages = vehiclesPerPage ? vehiclesPerPage.total_paginas : 0;

  const getVehiclesPerPage = useCallback(
    async (page: number) => {
      try {
        const _vehicles = await getVehiclesPerPageVehicles(page);
        setVehiclesPerPage(_vehicles);
      } catch (error) {
        console.log(error);
      }
    },
    [setVehiclesPerPage]
  );

  useEffect(() => {
    getVehiclesPerPage(1);
  }, [getVehiclesPerPage]);

  return (
    <Flex w="100vw" h="100vh" direction="column" gap="md">
      <Table.ScrollContainer minWidth={"100%"} type="native">
        <Table
          striped
          highlightOnHover
          withTableBorder
          verticalSpacing="md"
          horizontalSpacing="lg"
          color="#3b68a5"
        >
          <Table.Thead>
            <Table.Tr>
              {keys.map((key) => (
                <Table.Th key={key} bg={"#3b68a5"}>
                  <Title ta={"center"} c="white" fw={800} size="lg">
                    {key}
                  </Title>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {vehiclesPerPage?.vehiculos.map((vehicle, index) => (
              <Table.Tr key={index}>
                {keys.map((key) => (
                  <Table.Td key={key}>
                    <Text ta={"center"}>
                      {vehicle[key as keyof typeof vehicle]}
                    </Text>
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Group justify="center" mb="xl">
        <Pagination total={pages} siblings={15} color="#3b68a5" withEdges />
      </Group>
    </Flex>
  );
};

export default App;
