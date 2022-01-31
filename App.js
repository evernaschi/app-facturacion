import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, ScrollView  } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const App = () => {
	const Stack = createNativeStackNavigator();
	return (
	<NavigationContainer>
		<Stack.Navigator
	    	screenOptions={{
				headerStyle: {
					backgroundColor: '#0099ff',
				},
				headerTintColor: '#fff',
				headerTitleStyle: {
					fontWeight: 'bold',
				},
				headerTitleAlign: 'center',
			}}
		>
			<Stack.Screen
			name="SeleccionCliente"
			component={SeleccionClienteScreen}
			options={{ 
				title: 'Seleccionar Cliente',
			}}
			/>
			<Stack.Screen name="SeleccionDireccion" 
			component={SeleccionDireccionScreen} 
			options={{ 
				title: 'Seleccionar Dirección',
			}}			
			/>
			<Stack.Screen name="Facturacion" 
			component={FacturacionScreen} 
			options={{ 
				title: 'Facturacion',
			}}			
			/>
		</Stack.Navigator>
	</NavigationContainer>
	);
}

export default App;

const SeleccionClienteScreen = ({ navigation }) => {
	const fileClientes = require('./assets/data.json');
	const [selectedItem, setSelectedItem] = useState(null);
	let clientes = fileClientes.infoClientes
	clientes = clientes.map((item, index) => ({ ...item, id: index, title:item.Cliente }))
	return (
		<View style={styles.containerCentered}>
			<View style={styles.section}>
				{/* <StatusBar style="auto" /> */}
				<AutocompleteDropdown
					clearOnFocus={false}
					closeOnBlur={true}
					closeOnSubmit={true}
					textInputProps={{
						placeholder: "Ingrese el nombre...",
						style: {
							borderRadius: 10,
							backgroundColor: "#fff",
							color: "#000000",
							paddingLeft: 18,
							borderWidth: 1,
							borderColor: "#000000",
							width: "100%",
						}
					}}
					onSelectItem={setSelectedItem}
					dataSet={clientes}
				/>
			</View>
			<View style={styles.section}>
				<Button
						title="Confirmar"
						color="#0099ff"
						onPress={() => {
							if (selectedItem){
								navigation.navigate('SeleccionDireccion', { cliente: selectedItem })
							} else {
								alert("Seleccione un Cliente");
							}
						}}
						/>
			</View>
		</View>
	);
};

const SeleccionDireccionScreen = ({ navigation, route }) => {
	const [selectedItem, setSelectedItem] = useState(null);
	let direcciones = route.params.cliente.Direccion
	direcciones = (Array.isArray(direcciones)) ? direcciones : [direcciones];
	direcciones = direcciones.map(function(obj, index){
		let rObj = {};
		rObj['id'] = index;
		rObj['title'] = obj;
		return rObj;
	});
	return (
		<View style={styles.containerCentered}>
			<Text style={styles.centerText}>Seleccionar Dirección para el Cliente:</Text>
			<Text style={[styles.centerText, styles.boldText]}>{route.params.cliente.title}</Text>
			<View style={styles.section}>
				{/* <StatusBar style="auto" /> */}
				<AutocompleteDropdown
					clearOnFocus={false}
					closeOnBlur={true}
					closeOnSubmit={true}
					textInputProps={{
						placeholder: "Ingrese la direccion...",
						style: {
							borderRadius: 10,
							backgroundColor: "#fff",
							color: "#000000",
							paddingLeft: 18,
							borderWidth: 1,
							borderColor: "#000000",
							width: "100%",
						}
					}}
					initialValue={{ id: 0 }} // or just '2'
					onSelectItem={setSelectedItem}
					dataSet={direcciones}
					/>
			</View>
			<View style={styles.section}>
				<Button
					title="Confirmar"
					color="#0099ff"
					onPress={() => {
						if (selectedItem){
							navigation.navigate('Facturacion', { cliente:route.params.cliente, direccion: selectedItem })
						} else {
							alert("Seleccione una Direccion");
						}
					}}
				/>
			</View>
		</View>
	);
};

const FacturacionScreen = ({ navigation, route }) => {
	return (
		<View style={styles.container}>
			<ScrollView >
				<View style={[styles.row, styles.centerText, styles.top]}>
					<Text style={styles.centerText}>Cliente:</Text>
					<Text style={[styles.centerText, styles.boldText]}>{route.params.cliente.title}</Text>
				</View>
				<View style={[styles.row, styles.centerText]}>
					<Text style={styles.centerText}>Direccion:</Text>
					<Text style={[styles.centerText, styles.boldText]}>{route.params.direccion.title}</Text>
				</View>
				<Encabezado/>
				<Fila/>
			</ScrollView>
		</View>
	);
};

const Encabezado = () => {
	return (
	<View style={styles.row}>
			<Text style={[styles.celda, styles.boldText, {textAlign:"center"}]}>PRODUCTO</Text>
			<Text style={[styles.celda, styles.boldText, {textAlign:"center"}]}>CAJAS</Text>
			<Text style={[styles.celda, styles.boldText, {textAlign:"center"}]}>UNIDADES</Text>
	</View>
	)
}

const Fila = () => {
	const [text, onChangeText] = useState(null);
	const [number, onChangeNumber] = useState(null);
	return (
	<View style={styles.row}>
		<TextInput
			style={styles.celda}
			onChangeText={onChangeText}
			placeholder="Ingrese Producto"
			value={text}
		/>
		<TextInput
			style={styles.celda}
			onChangeText={onChangeNumber}
			value={number}
			placeholder="Ingrese Cajas"
			keyboardType="numeric"
			/>
		<TextInput
			style={styles.celda}
			onChangeText={onChangeNumber}
			value={number}
			placeholder="Ingrese Cantidad"
			keyboardType="numeric"
		/>
	</View>
	)
}

const styles = StyleSheet.create({
    centerText: {
        textAlignVertical: 'top',
        textAlign: 'center',
        marginVertical: 3,
		alignItems: 'center',
		justifyContent: 'center'
	},
    containerCentered: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 20,
		justifyContent: 'center',
	},
    container: {
		flex: 1,
		backgroundColor: '#fff',
		// padding: 20,
	},
	boldText: {
		fontWeight: 'bold'
	},
	top: {
		alignItems: "flex-start",
	},
	section: {
		marginBottom: 20,
		marginTop: 20,
	},
	celda: {
		height: 40,
		margin: 0,
		borderWidth: 1,
		padding: 10,
		flex:1,
	},
	row: {
		overflow: "hidden",
		flexDirection: "row",
		flexWrap: "nowrap",
		alignContent: "stretch",
	},
});
