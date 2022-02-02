import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Pressable, Animated } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

import GmailStyleSwipeableRow from './swipable/GmailStyleSwipeableRow';

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
		rObj['id'] = index+1;
		// Uso index+1 porque initial value con 0 no funciona
		rObj['title'] = obj;
		return rObj;
	});
	// Si tiene una sola dirección la pongo de initialValue, si tiene más de una entonces no pongo ninguna
	const initialValue = direcciones.length === 1 ? {id:1} : {id:0}
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
					initialValue={initialValue} // or just '2'
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
	const [count, setCount] = useState(1)
	const [filas, setFilas] = useState([0])
	const eliminarFila = (key) => {
		setFilas(filas.filter(i => i !== key));
	}
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
				{/* { filas.map((i) => <Fila key={i} index={i} eliminarFilaCallback={eliminarFila}/>) } */}
				<GestureHandlerRootView>
				{ filas.map((i) =>
					<GmailStyleSwipeableRow key={i}>
					<Fila key={i} index={i} eliminarFilaCallback={eliminarFila}/>
					</GmailStyleSwipeableRow>
				)}
				</GestureHandlerRootView>
				<View style={styles.containerCentered}>
				<Button
					title="Nueva Fila"
					color="#0099ff"
					onPress={ () => {
						setFilas([...filas, count]);
						setCount(count + 1);
					}}
					/>
				</View>
			</ScrollView>
		</View>
	);
};

const Encabezado = () => {
	return (
	<View style={[styles.row, {borderTopColor:"black",borderBottomWidth:1}]}>
			<Text style={[styles.celda, styles.boldText, {flex:3}]}>PRODUCTO</Text>
			<Text style={[styles.celda, styles.boldText]}>CAJAS</Text>
			<Text style={[styles.celda, styles.boldText]}>UNID</Text>
			<View style={{flexDirection:"row", justifyContent:"flex-end", flex:1.3}}>
				<AnimatedIcon name="delete-forever" size={30} color="black" style={[styles.actionIcon, {paddingTop:5}]}/>
			</View>
	</View>
	)
}

const Fila = (props) => {
	const [text, onChangeText] = useState("");
	const [cajas, onChangeCajas] = useState("");
	const [unidades, onChangeUnidades] = useState("");
	return (
	<View style={[styles.row, {borderTopColor:"black",borderBottomWidth:1}]}>
		<TextInput
			style={[styles.celda, {flex:3}]}
			onChangeText={onChangeText}
			placeholder="Ingrese Producto"
			value={text}
		/>
		<TextInput
			style={styles.celda}
			onChangeText={onChangeCajas}
			value={cajas}
			placeholder="Cajas"
			keyboardType="numeric"
			/>
		<TextInput
			style={styles.celda}
			onChangeText={onChangeUnidades}
			value={unidades}
			placeholder="Cant"
			keyboardType="numeric"
			/>
		<View style={{flexDirection:"row", justifyContent:"flex-end", flex:1.3}}>
		<AnimatedIcon
			name="delete-forever"
			size={30}
			color="red"
			style={[styles.actionIcon, {paddingTop:8}]}
			/>
		</View>
		{/* <View style={[styles.row, styles.celda, {paddingVertical:0}]}> */}
			{/* <Pressable onPress={() => {props.eliminarFilaCallback(props.index)}} style={styles.deleteButton}>
				<Text style={{alignSelf:"center", color:"white", fontWeight: 'bold', fontSize:20}}>X</Text>
			</Pressable> */}
		{/* </View> */}
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
		height: 45,
		padding: 5,
		flex:1,
		textAlign:"left",
		textAlignVertical:"center",
	},
	row: {
		// borderWidth: 1,
		// margin:5,
		// borderRadius:5,
		overflow: "hidden",
		flexDirection: "row",
		flexWrap: "nowrap",
		// alignContent: "stretch",
		backgroundColor: 'white',
		justifyContent:"space-between",
	},
	deleteButton: {
		position: 'absolute',
		right:0,
		top:0,
		bottom:0,
		width:25,
		backgroundColor:"red",
		color:"white",
		textAlign:"center",
		justifyContent:"center",
	},
	actionIcon: {
		width: 30,
		marginHorizontal: 10
	  },
	});
