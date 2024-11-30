import { Flex, Group, Pagination, Table, Text, Title } from '@mantine/core'
import { useCallback, useEffect, useId, useState } from 'react'
import { getVehiclesPerPageVehicles } from './network/getVehiclesPerPage'

type TVehicle = {
	census_tract_2020: string
	base_msrp: string
	cafv_type: string
	city: string
	county: string
	dol_vehicle_id: string
	electric_range: string
	electric_utility: string
	ev_type: string
	geocoded_column: string
	legislative_district: string
	make: string
	model: string
	model_year: string
	state: string
	vin: string
	zip_code: string
}

type TVehicles = {
	total_vehiculos: number
	total_paginas: number
	pagina_actual: number
	tamanho_pagina: number
	vehiculos: TVehicle[]
}

const vehicles = {
	total_vehiculos: 216773,
	total_paginas: 21678,
	pagina_actual: 2,
	tamaño_pagina: 10,
	vehiculos: [
		{
			census_tract_2020: '53033027100',
			base_msrp: '0',
			cafv_type: 'Clean Alternative Fuel Vehicle Eligible',
			city: 'Burien',
			county: 'King',
			dol_vehicle_id: '213452795',
			electric_range: '73',
			electric_utility: 'CITY OF SEATTLE - (WA)|CITY OF TACOMA - (WA)',
			ev_type: 'Battery Electric Vehicle (BEV)',
			geocoded_column: 'POINT (-122.3317 47.50314)',
			legislative_district: '33',
			make: 'NISSAN',
			model: 'LEAF',
			model_year: '2012',
			state: 'WA',
			vin: 'JN1AZ0CP2C',
			zip_code: '98168'
		},
		{
			census_tract_2020: '53035090902',
			base_msrp: '0',
			cafv_type: 'Clean Alternative Fuel Vehicle Eligible',
			city: 'Bainbridge Island',
			county: 'Kitsap',
			dol_vehicle_id: '104355884',
			electric_range: '322',
			electric_utility: 'PUGET SOUND ENERGY INC',
			ev_type: 'Battery Electric Vehicle (BEV)',
			geocoded_column: 'POINT (-122.521 47.62728)',
			legislative_district: '23',
			make: 'TESLA',
			model: 'MODEL 3',
			model_year: '2020',
			state: 'WA',
			vin: '5YJ3E1EBXL',
			zip_code: '98110'
		}
	]
}

type filters = {
	model_year: string
	city: string
	make: string
}

const App = () => {
	const modelYearFilteredId = useId()
	const cityFilteredId = useId()
	const makeFilteredId = useId()

	const [pageSelected, setPageSelected] = useState<number>(1)
	const [vehiclesPerPage, setVehiclesPerPage] = useState<TVehicles>()
	const [filter, setFilters] = useState<filters>({
		model_year: '',
		city: '',
		make: 'all'
	})
	const [vehiclesFiltered, setVehiclesFiltered] = useState<
		TVehicle[] | undefined
	>(vehiclesPerPage?.vehiculos)

	const keys =
		vehiclesPerPage && vehiclesPerPage.vehiculos.length > 0
			? Object.keys(vehicles.vehiculos[0])
			: []

	const pages = vehiclesPerPage ? vehiclesPerPage.total_paginas : 0

	const getVehiclesPerPage = useCallback(
		async (page: number) => {
			console.log('page:', page)
			try {
				const _vehicles = await getVehiclesPerPageVehicles(page)
				setVehiclesPerPage(_vehicles)
			} catch (error) {
				console.log(error)
			}
		},
		[setVehiclesPerPage]
	)

	useEffect(() => {
		getVehiclesPerPage(pageSelected)
	}, [getVehiclesPerPage, pageSelected])

	useEffect(() => {
		if (vehiclesPerPage) {
			const filtered = vehiclesPerPage.vehiculos.filter((vehicle) => {
				return (
					(filter.model_year === '' ||
						vehicle.model_year === filter.model_year) &&
					(filter.city === '' || vehicle.city === filter.city) &&
					(filter.make === 'all' || vehicle.make === filter.make)
				)
			})
			setVehiclesFiltered(filtered)
		}
	}, [filter, vehiclesPerPage])

	const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFilters((prev) => ({
			...prev,
			model_year: e.target.value
		}))
	}

	const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFilters((prev) => ({
			...prev,
			city: e.target.value
		}))
	}

	const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setFilters((prev) => ({
			...prev,
			make: e.target.value
		}))
	}

	return (
		<Flex
			w='100vw'
			h='100vh'
			direction='column'
			gap='md'
		>
			<Table.ScrollContainer
				minWidth={'100%'}
				type='native'
			>
				<Table
					striped
					highlightOnHover
					withTableBorder
					verticalSpacing='md'
					horizontalSpacing='lg'
					color='#3b68a5'
				>
					<Table.Thead>
						<Table.Tr>
							{keys.map((key) => (
								<Table.Th
									key={key}
									bg={'#3b68a5'}
								>
									<Title
										ta={'center'}
										c='white'
										fw={800}
										size='lg'
									>
										{key}
									</Title>
								</Table.Th>
							))}
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{vehiclesFiltered
							? vehiclesFiltered.map((vehicle, index) => (
									<Table.Tr key={index}>
										{keys.map((key) => (
											<Table.Td key={key}>
												<Text ta={'center'}>
													{vehicle[key as keyof typeof vehicle]}
												</Text>
											</Table.Td>
										))}
									</Table.Tr>
							  ))
							: vehiclesPerPage?.vehiculos.map((vehicle, index) => (
									<Table.Tr key={index}>
										{keys.map((key) => (
											<Table.Td key={key}>
												<Text ta={'center'}>
													{vehicle[key as keyof typeof vehicle]}
												</Text>
											</Table.Td>
										))}
									</Table.Tr>
							  ))}
					</Table.Tbody>
				</Table>
			</Table.ScrollContainer>
			<Group
				justify='center'
				mb='xl'
			>
				<Pagination
					total={pages}
					siblings={15}
					color='#3b68a5'
					withEdges
					onChange={(page) => {
						console.log('Página clickeada:', page)
						setPageSelected(page)
						// Llama a la función para obtener los vehículos de la página clickeada
					}}
				/>
				<section className='filters'>
					<div className='filter-item'>
						<label htmlFor={modelYearFilteredId}>Year</label>
						<input
							type='text'
							id={modelYearFilteredId}
							onChange={handleYearChange}
						/>
					</div>
					<div className='filter-item'>
						<label htmlFor={cityFilteredId}>City</label>
						<input
							type='text'
							id={modelYearFilteredId}
							onChange={handleCityChange}
						/>
					</div>

					<div className='filter-item'>
						<label htmlFor={makeFilteredId}>Make</label>
						<select
							id={makeFilteredId}
							onChange={handleMakeChange}
						>
							<option value='all'>Todas</option>
							<option value='NISSAN'>NISSAN</option>
							<option value='TESLA'>TESLA</option>
							<option value='VOLKSWAGEN'>VOLKSWAGEN</option>
							<option value='TOYOTA'>TOYOTA</option>
							<option value='NISSAN'>FORD</option>
							<option value='TESLA'>JEEP</option>
							<option value='VOLKSWAGEN'>BMW</option>
              <option value='KIA'>KIA</option>
							<option value='CHRYSLER'>CHRYSLER</option>
							<option value='CHEVROLET'>CHEVROLET</option>
						</select>
					</div>
				</section>
			</Group>
		</Flex>
	)
}

export default App
