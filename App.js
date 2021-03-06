import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Animated, Pressable, Alert, addons } from 'react-native';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { useState, useRef, createRef, forwardRef, Component, useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as FileSystem from 'expo-file-system';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import GmailStyleSwipeableRow from './components/GmailStyleSwipeableRow';
import FilaProducto, { FilaArchivo } from './components/Filas';
import Checkbox from 'expo-checkbox';
import * as Sharing from 'expo-sharing';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const uri = FileSystem.documentDirectory;

const uriPedidosNuevos = uri + "PedidosNuevos/"
const uriPedidosEnviados = uri + "PedidosEnviados/"

const App = () => {
    require('intl')
    require('intl/locale-data/jsonp/es.js');
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
            name="Home"
            component={HomeScreen}
            options={{
                title: 'Home',
            }}
        />
        <Stack.Screen
            name="ListarFacturas"
            component={ListarFacturasScreen}
            options={({ navigation, route }) => ({
                title: "Facturas" + (route.params && route.params.verEnviados ? ' Enviadas' : ''),
            })}
        />
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
                title: 'Seleccionar Direcci??n',
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

const HomeScreen = ({ navigation }) => {
    return (
        <View style={[styles.containerCentered]}>
            <View style={[{alignItems:"center", justifyContent:"space-around", flex:1}]}>
                <Pressable onPress={() => navigation.navigate('SeleccionCliente')}>
                    <AnimatedIcon
                    name="note-add"
                    size={120}
                    color="#0099ff"
                    />
                </Pressable>
                <Pressable onPress={() => navigation.navigate('ListarFacturas')}>
                    <AnimatedIcon
                    name="format-list-bulleted"
                    size={120}
                    color="#0099ff"
                    />
                </Pressable>
            </View>
        </View>   
    )
}

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
    const cliente = route.params.cliente
    let direcciones = cliente.Direccion
    direcciones = (Array.isArray(direcciones)) ? direcciones : [direcciones];
    direcciones = direcciones.map(function(obj, index){
        let rObj = {};
        rObj['id'] = index+1;
        // Uso index+1 porque initial value con 0 no funciona
        rObj['title'] = obj;
        return rObj;
    });
    // Si tiene una sola direcci??n la pongo de initialValue, si tiene m??s de una entonces no pongo ninguna
    const initialValue = direcciones.length === 1 ? {id:1} : {id:0}
    return (
        <View style={styles.containerCentered}>
            <Text style={styles.centerText}>Seleccionar Direcci??n para el Cliente:</Text>
            <Text style={[styles.centerText, styles.boldText]}>{cliente.title}</Text>
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
                            navigation.navigate('Facturacion', { cliente:cliente, direccion: selectedItem })
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
    // let productos = fileProductos.infoProductos
    if (!route.params){alert("Faltan los parametros");navigation.navigate("Home");return(null)}
    if (!route.params.cliente){alert("Falta el Cliente");navigation.navigate("Home");return(null)}
    if (!route.params.direccion){alert("Falta la Direcci??n");navigation.navigate("Home");return(null)}
    const cliente = route.params.cliente
    const direccion = route.params.direccion
    const [count, setCount] = useState(0)
    const emptyFila = {cajas: "",unidades: "",value: "",producto: null,}
    const [dataFila, setDataFila] = useState({})
    const [filasElementos, setFilasElementos] = useState([])
    const [editable, setEditable] = useState(route.params.nombreArchivo ? false : true)

    useEffect(() =>{
        if (route.params.dataArchivo){
            setDataFila(route.params.dataArchivo);
            setCount(Object.keys(route.params.dataArchivo).length);
        } else {
            setDataFila({[count.toString()]:emptyFila});
        }
    }, [])


    useEffect(() =>{
        actualizarFilasElementos()
    }, [dataFila, editable])

    const eliminarFila = (key) => {
        if (!editable){
            Alert.alert("Advertencia", "No puede eliminar filas en modo lectura")
            return false
        }
        const newDataFila = { ...dataFila };
        if (newDataFila[key]){
            delete newDataFila[key]
            setDataFila(newDataFila)
        }
    }

    const addFila = (indice=false) => {
        if (!editable){
            Alert.alert("Advertencia", "No puede agregar filas en modo lectura")
            return false
        }
        const maxIndex = !isEmpty(dataFila) ? Object.entries(dataFila).reduce((a, b) => a[1] > b[1] ? a : b)[0] : 0
        if (indice && (indice) != maxIndex){return}
        let newCount = count+1
        setCount(newCount)
        const newDataFila = {
            ...dataFila,
            [newCount.toString()] : emptyFila 
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

    const confirmar = async (nombreArchivo = false) => {
        var filteredFilas = Object.fromEntries(Object.entries(dataFila).filter(([k,v]) => !isEqual(v,emptyFila)));
        if (isEmpty(filteredFilas)){
            Alert.alert("Alerta", "Complete al menos una fila")
            return false
        }
        const uri = uriPedidosNuevos
        
        // Formo el nombre del archivo con: Cliente + Direccion + Fecha
        let nameCliente = cliente.Cliente.replace(/\s+/g, '')
        if (nameCliente.length > 15){
            nameCliente = nameCliente.substring(0, 15)
        }
        
        // Para la direccion tomo solo lo que est?? antes de la coma, es decir la calle
        // La direccion completa se guarda en el archivo
        let nameDireccion = direccion.title.split(",")[0]
        nameDireccion = nameDireccion.replace(/\s+/g, '')
        if (nameDireccion.length > 30){
            nameDireccion = nameDireccion.substring(0, 30)
        }
        var today  = new Date();
        let fecha = today.toLocaleString().replace(/\//g, "-").replace(/ /g, "_")
        fecha = fecha.replace(/\//g, "-")
        
        let fileName = "/" + nameCliente + "_" + nameDireccion + "_" + fecha + ".json"
        
        if (nombreArchivo) {fileName = nombreArchivo}

        const archivo = {'filas': filteredFilas, "cliente": cliente, "direccion": direccion, fecha:today}
        FileSystem.writeAsStringAsync(uri + fileName, JSON.stringify(archivo))
        Alert.alert("Exito!", "Factura creada exitosamente")
        navigation.navigate('Home')
    }

    const actualizarFilasElementos = () => {
        let newFilasElementos = []
        for (const [i, fila] of Object.entries(dataFila)) {
            if (fila) {
                newFilasElementos.push(
                <GmailStyleSwipeableRow key={i} index={i} eliminarFilaCallback={eliminarFila}>
                <FilaProducto
                value={fila.value}
                cajas={fila.cajas}
                unidades={fila.unidades}
                producto={fila.producto}
                index={i}
                key={i}
                editable={editable}
                actualizarDataFilaCallback={actualizarDataFila}
                eliminarFilaCallback={eliminarFila}
                addFilaCallback={addFila}
                />
                </GmailStyleSwipeableRow>
                )
            }
        }
        setFilasElementos(newFilasElementos)
    }

    const buttonEditar = (
        <Button
        title="Editar"
        color="#454034"
        onPress={ () => {
            // Alert.alert("Atenci??n", "Edici??n habilitada")
            setEditable(true)
        }}
        />
    )

    const buttonConfirmar = (
        <Button
        title={ route.params.nombreArchivo ? "Guardar Como Nuevo" : "Confirmar"}
        color="#36a854"
        onPress={ () => confirmar() }
        />
    )

    const buttonSobreescribir = (
        <Button
        title={ "Sobreescribir" }
        color="#36a854"
        onPress={ () => confirmar(route.params.nombreArchivo) }
        />
    )

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={[styles.row, styles.centerText, styles.top]}>
                    <Text style={styles.centerText}>Cliente:</Text>
                    <Text style={[styles.centerText, styles.boldText]}>{cliente.title}</Text>
                </View>
                <View style={[styles.row, styles.centerText]}>
                    <Text style={styles.centerText}>Direccion:</Text>
                    <Text style={[styles.centerText, styles.boldText]}>{direccion.title}</Text>
                </View>
                {/* <View style={[styles.containerCentered, styles.row]}> */}
                <View style={[styles.containerCentered, editable && route.params.nombreArchivo ? styles.row : null, {justifyContent:"space-around"}]}>
                    {editable ? buttonConfirmar : buttonEditar}
                    {editable && route.params.nombreArchivo ? buttonSobreescribir : null}
                </View>
                <Encabezado/>
                <GestureHandlerRootView>
                {filasElementos}
                </GestureHandlerRootView>
                <View style={styles.containerCentered}>
                <Button
                    title="Nueva Fila"
                    color="#0099ff"
                    disabled={!editable}
                    // Hay que llamar a addFila as?? para que llegue sin argumentos
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

const EncabezadoLectura = () => {
    const [isChecked, setChecked] = useState(false);
    return (
    <View style={[styles.row, {borderBottomWidth:1}]}>
            <View style={{alignItems: 'center', flexDirection:"column", justifyContent:"space-around"}}>
                <Checkbox style={[{marginHorizontal:1}]} value={isChecked} onValueChange={setChecked} color={isChecked ? '#0099ff' : undefined}/>
            </View>
            <Text style={[styles.celda, styles.boldText]}>CLIENTE</Text>
            <Text style={[styles.celda, styles.boldText]}>DIRECCION</Text>
            <Text style={[styles.celda, styles.boldText, {flex:0.5}]}>FECHA</Text>
            <View style={{flexDirection:"row", justifyContent:"flex-end"}}>
                <AnimatedIcon name="search" size={30} color="black" style={[styles.actionIcon, {paddingTop:5}]}/>
            </View>
    </View>
    )
}

const ListarFacturasScreen = ({navigation, route}) => {
    const [isChecked, setIsChecked] = useState(false)
    const [dataFila, setDataFila] = useState({})
    const [filasElementos, setFilasElementos] = useState([])
    let verEnviados = route.params && route.params.verEnviados ? true : false
    let uri = !verEnviados ? uriPedidosNuevos : uriPedidosEnviados

    const deleteFile = (index) => {
        const newDataFila = {... dataFila}
        if (newDataFila.hasOwnProperty(index)){
            const fileName = newDataFila[index].fileName
            FileSystem.deleteAsync(uri + fileName).catch(() => {})
            delete newDataFila[index]
            setDataFila(newDataFila);
        }
    }

    const eliminarSeleccionados = () => {
        let archivosSeleccionados = Object.fromEntries(Object.entries(dataFila).filter(([k,v]) => v['isChecked']));
        if (isEmpty(archivosSeleccionados)){
            Alert.alert("Alerta", "Seleccione al menos un archivo")
            return false
        }
        Alert.alert(
            "Advertencia",
            "??Desea eliminar los archivos seleccionados?",
            [
                {
                    text: "S??",
                    onPress: () => {
                        for (let file_index in Object.keys(archivosSeleccionados)){deleteFile(file_index)}
                    }
                },
                {
                    text: "Cancelar",
                    onPress: () => {return false},
                },
            ],
            {cancelable: true,}
        );
    }

    const moveFile = (index, from, to) => {
        const newDataFila = {... dataFila}
        if (newDataFila.hasOwnProperty(index)){
            FileSystem.moveAsync({
                'from': from,
                'to': to,
            }).catch(() => {})
            delete newDataFila[index]
        setDataFila(newDataFila);
        }
    }

    const leerFiles = async () => {
        await FileSystem.readDirectoryAsync(uriPedidosNuevos).catch(()=> FileSystem.makeDirectoryAsync(uriPedidosNuevos))
        await FileSystem.readDirectoryAsync(uriPedidosEnviados).catch(()=> FileSystem.makeDirectoryAsync(uriPedidosEnviados))
    
        const newFiles = await FileSystem.readDirectoryAsync(uri)
            .catch(()=> FileSystem.makeDirectoryAsync(uri)
                .catch(() => {})
            );
        let newDataFila = {  };
        let i = 0
        for (let fileName of newFiles){
            FileSystem.readAsStringAsync(uri + fileName)
            .then(file => {
                file = JSON.parse(file)
                if (file && file.hasOwnProperty("cliente") && file.hasOwnProperty("direccion")) {
                    newDataFila[i.toString()] = {'file':file, 'isChecked':false, 'fileName':fileName}
                    i++
                    if (i >= newFiles.length){
                        setDataFila(newDataFila);
                    }
                }
            })
            .catch(() => alert("No se encontro " + fileName))
        }
    };

    const enviar = () => {
        let archivosSeleccionados = Object.fromEntries(Object.entries(dataFila).filter(([k,v]) => v['isChecked']));
        if (isEmpty(archivosSeleccionados)){
            Alert.alert("Alerta", "Seleccione al menos un archivo")
            return false
        }
        var today  = new Date();
        let fecha = today.toLocaleString().replace(/\//g, "-").replace(/ /g, "_")
        fecha = fecha.replace(/\//g, "-")
        
        let fileName = "Pedido_Whisper_" + fecha + ".json"
        FileSystem.writeAsStringAsync(uri + fileName, JSON.stringify({'archivos':archivosSeleccionados}))
        Sharing.shareAsync(uri + fileName)
        .then(()=>{
            Object.entries(archivosSeleccionados).map((elem)=>{
                let index = elem[0]
                let file = elem[1]
                let from = uri + file.fileName
                let to = uriPedidosEnviados + file.fileName
                moveFile(index, from, to)
            })
            FileSystem.deleteAsync(uri + fileName)
            actualizarFilasElementos()
        })
        .catch()
    }

    useEffect(() =>{
        leerFiles()
    }, [])

    useEffect(() =>{
        actualizarFilasElementos()
    }, [dataFila])
    
    const actualizarDataFila = (index, data) => {
        const newDataFila = { ...dataFila };
        if (newDataFila[index]){
            let fila = newDataFila[index]
            for (const [key, value] of Object.entries(data)){
                // Actualizo solo los atributos enviados
                fila[key] = value
            }
            newDataFila[index] = fila
            setDataFila(newDataFila)
            let archivosSeleccionados = Object.entries(newDataFila).filter(([k,v]) => v['isChecked'])
            let archivosNoSeleccionados = Object.entries(newDataFila).filter(([k,v]) => !v['isChecked'])
            if (archivosSeleccionados.length == 0){
                // Si se destild?? un archivo y no hay archivos seleccionados el tilde global se destilda
                setIsChecked(false)
            }
            else if (archivosNoSeleccionados.length == 0){
                // Si se tild?? un archivo y todos los archivos est??n seleccionados el tilde global se tilda
                setIsChecked(true)
            }
        }
    }

    const onChangeChecked = (newIsChecked) => {
        const newDataFila = { ...dataFila };
        Object.keys(newDataFila).map(function(key, index) {
            let file = newDataFila[key]
            file['isChecked'] = newIsChecked
        })
        setIsChecked(newIsChecked)
        setDataFila(newDataFila)
    }

    const actualizarFilasElementos = () => {
        let newFilasElementos = []
        for (const [i, fila] of Object.entries(dataFila)) {
            if (fila) {
                let file = fila.file
                newFilasElementos.push(
                <GmailStyleSwipeableRow key={i} index={i} eliminarFilaCallback={() => deleteFile(i)}>
                    <FilaArchivo
                    isChecked={isChecked}
                    actualizarDataFilaCallback={actualizarDataFila}
                    file={file}
                    nombreArchivo={fila.fileName}
                    index={i}
                    key={i}
                    navigation={navigation}
                    />
                </GmailStyleSwipeableRow>
                )
            }
        }
        setFilasElementos(newFilasElementos)
    }

    const botones = (
        <View style={[styles.containerCentered, styles.row , {justifyContent:"space-around"}]}>
        <Button
            title="Enviar"
            color="#36a854"
            onPress={ enviar }
        />
        <Button
            title="Ver Enviados"
            color="#454034"
            onPress={ () => navigation.push("ListarFacturas", {'verEnviados':true}) }
        />
        <Button
            title="Eliminar"
            color="red"
            onPress={ eliminarSeleccionados }
        />
    </View>
    )

    return(
    <View style={styles.container}>
        <ScrollView>
            {!verEnviados && botones}
            <View style={[styles.row, {borderBottomWidth:1}]}>
                <View style={{alignItems: 'center', flexDirection:"column", justifyContent:"space-around"}}>
                    <Checkbox style={[{marginLeft:5}]} value={isChecked} onValueChange={onChangeChecked} color={isChecked ? '#0099ff' : undefined}/>
                </View>
                <Text style={[styles.celda, styles.boldText]}>CLIENTE</Text>
                <Text style={[styles.celda, styles.boldText]}>DIRECCION</Text>
                <Text style={[styles.celda, styles.boldText, {flex:0.6}]}>FECHA</Text>
                <View style={{flexDirection:"row", justifyContent:"flex-end"}}>
                    <AnimatedIcon name="search" size={30} color="black" style={[styles.actionIcon, {paddingTop:5}]}/>
                </View>
            </View>
            <GestureHandlerRootView>
            {filasElementos}
            </GestureHandlerRootView>
        </ScrollView>
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

});
