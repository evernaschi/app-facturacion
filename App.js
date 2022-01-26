import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const App = () => {
	// const fileClientes = require('./assets/clientes.json');
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
		<View style={styles.container}>
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
						onPress={() =>
							navigation.navigate('SeleccionDireccion', { cliente: selectedItem })
						}
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
		<View style={styles.container}>
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
					// onPress={() =>
					// navigation.navigate('SeleccionDireccion', { cliente: selectedItem })
					// }
					/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
    centerText: {
        textAlignVertical: 'top',
        textAlign: 'center',
        marginVertical: 3,
        // fontSize: 20,
	},
    container: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 20,
		// alignItems: 'center',
		justifyContent: 'center',
	},
	boldText: {
		fontWeight: 'bold'
	},
	section: {
		marginBottom: 20,
		marginTop: 20,
	},
});
