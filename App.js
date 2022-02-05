import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Animated, SafeAreaView } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { useState, useRef, createRef, forwardRef, Component } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Dropdown } from 'react-native-element-dropdown';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

import GmailStyleSwipeableRow from './components/GmailStyleSwipeableRow';

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
    let clientes = fileClientes.infoClientes
    const [selectedItem, setSelectedItem] = useState(null);
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
                    rightButtonsContainerStyle={{
                        borderRadius: 10,
                        right: 5,
                        top: 8,
                        height: 30,
                        alignSelfs: "center",
                        backgroundColor: "#fff"
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
                    rightButtonsContainerStyle={{
                        borderRadius: 10,
                        right: 5,
                        top: 8,
                        height: 30,
                        alignSelfs: "center",
                        backgroundColor: "#fff"
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
    const fileProductos = require('./assets/infoProductos.json');
    let productos = fileProductos.infoProductos
    const [count, setCount] = useState(0)
    const [dataFila, setDataFila] = useState({[count.toString()]:{cajas: "",unidades: "",value: "",producto: null,}})

    const eliminarFila = (key) => {
        const newDataFila = { ...dataFila };
        if (newDataFila[key]){
            delete newDataFila[key]
            setDataFila(newDataFila)
        }
    }

    const addFila = (indice=false) => {
        const maxIndex = Object.entries(dataFila).reduce((a, b) => a[1] > b[1] ? a : b)[0]
        if (indice && (indice) != maxIndex){return}
        let newCount = count+1
        setCount(newCount)
        const newDataFila = {
            ...dataFila,
            [newCount.toString()] : {cajas: "",unidades: "",value: "",producto: null,} 
        };
        setDataFila(newDataFila)
    }

    const actualizarDataFila = (key, data) => {
        const newDataFila = { ...dataFila };
        if (newDataFila[key]){
            newDataFila[key] = data
            setDataFila(newDataFila)
        }
    }

    const confirmar = () => {
        console.log("Confirmar", dataFila)
    }

    let filasElementos = []
    for (const [i, fila] of Object.entries(dataFila)) {
        if (fila) {
            filasElementos.push(
            <GmailStyleSwipeableRow key={i} index={i} eliminarFilaCallback={eliminarFila}>
            <Fila
            value={fila.value}
            cajas={fila.cajas}
            unidades={fila.unidades}
            producto={fila.producto}
            productos={productos}
            index={i}
            key={i}
            actualizarDataFilaCallback={actualizarDataFila}
            eliminarFilaCallback={eliminarFila}
            addFilaCallback={addFila}
            />
            </GmailStyleSwipeableRow>
            )
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={[styles.row, styles.centerText, styles.top]}>
                    <Text style={styles.centerText}>Cliente:</Text>
                    <Text style={[styles.centerText, styles.boldText]}>{route.params.cliente.title}</Text>
                </View>
                <View style={[styles.row, styles.centerText]}>
                    <Text style={styles.centerText}>Direccion:</Text>
                    <Text style={[styles.centerText, styles.boldText]}>{route.params.direccion.title}</Text>
                </View>
                <View style={styles.containerCentered}>
                <Button
                    title="Confirmar"
                    color="#36a854"
                    onPress={ confirmar }
                    />
                </View>
                <Encabezado/>
                <GestureHandlerRootView>
                {filasElementos}
                </GestureHandlerRootView>
                <View style={styles.containerCentered}>
                <Button
                    title="Nueva Fila"
                    color="#0099ff"
                    // Hay que llamar a addFila así para que llegue sin argumentos
                    onPress={ () => addFila() }
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const Encabezado = () => {
    return (
    <View style={[styles.row, {borderBottomWidth:1}]}>
            <Text style={[styles.celda, styles.boldText, {flex:3}]}>PRODUCTO</Text>
            <Text style={[styles.celda, styles.boldText]}>CAJAS</Text>
            <Text style={[styles.celda, styles.boldText]}>UNID</Text>
            <View style={{flexDirection:"row", justifyContent:"flex-end", flex:1.3}}>
                <AnimatedIcon name="delete-forever" size={30} color="black" style={[styles.actionIcon, {paddingTop:5}]}/>
            </View>
    </View>
    )
}

class Fila extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cajas: props.cajas,
            unidades: props.unidades,
            value: props.value,
            producto: props.producto,
        };
        this.secondTextInput = createRef();
        this.thirdTextInput = createRef();
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.state != prevState) {
            let data = this.state
            this.props.actualizarDataFilaCallback(this.props.index, data)
        }
    }

    calcularUnidades = () => {
        if (this.state.producto && this.state.producto.UNIDADES){
            let newUnidades = this.state.cajas * this.state.producto.UNIDADES
            this.setState({unidades:newUnidades.toString()});
        }
    }

    calcularCajas = () => {
        if (this.state.producto && this.state.producto.UNIDADES){
            let newUnidades = this.state.unidades / this.state.producto.UNIDADES
            newUnidades = Math.round(newUnidades * 100) / 100
            // Redondeo a 2 decimales
            this.setState({cajas:newUnidades.toString()});
        }
        this.props.addFilaCallback(this.props.index)
    }

    render() {
        return (
            <View style={[styles.row, {borderBottomWidth:1}]}>
            <Dropdown
                style={[styles.dropdown, {flex:3}]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={this.props.productos}
                search
                maxHeight={300}
                labelField="DESCRIPCION"
                valueField="id"
                placeholder="Producto"
                searchPlaceholder="Buscar..."
                value={this.state.value}
                onChange={item => { this.setState({value: item.id, producto:item});}}
                onBlur={() => { this.secondTextInput.focus(); }}
                dropdownPosition="top"
                renderRightIcon={() => (null)}
            />
            <TextInput
                style={styles.celda}
                onChangeText={item => this.setState({cajas: item}) }
                value={this.state.cajas}
                placeholder="Cajas"
                keyboardType="numeric"
                ref={(input) => { this.secondTextInput = input; }}
                onBlur={this.calcularUnidades }
                onSubmitEditing={() => {
                    if (this.state.producto.UNIDADES){
                        let newUnidades = this.state.cajas * this.state.producto.UNIDADES
                        this.setState({unidades:newUnidades.toString()});
                    }
                    this.thirdTextInput.focus();
                }}
            />
            <TextInput
                style={styles.celda}
                onChangeText={item => this.setState({unidades: item}) }
                value={this.state.unidades}
                placeholder="Unid"
                keyboardType="numeric"
                ref={(input) => { this.thirdTextInput = input; }}
                onBlur={this.calcularCajas}
                onSubmitEditing={this.calcularCajas}
            />
            <View style={{flexDirection:"row", justifyContent:"flex-end", flex:1.3}}>
                <AnimatedIcon
                    name="delete-forever"
                    size={30}
                    color="red"
                    style={[styles.actionIcon, {paddingTop:8}]}
                />
            </View>
        </View>
        );
    }
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
        flexDirection: "row",
        overflow: "hidden",
        flexWrap: "nowrap",
        backgroundColor: 'white',
        justifyContent:"space-between",
    },
    actionIcon: {
        width: 30,
        marginHorizontal: 10
      },
      dropdown: {
      },
      icon: {
        marginRight: 5,
      },
      placeholderStyle: {
        fontSize: 14,
        color:"darkgrey",
    },
    selectedTextStyle: {
        fontSize: 14,
        color:"black",
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },

    });
