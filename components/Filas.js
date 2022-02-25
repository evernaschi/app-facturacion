import { StyleSheet, View, Text, TextInput, Animated, Pressable } from 'react-native';
import { createRef, Component, useState, useEffect } from "react";
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialIcons';
const AnimatedIcon = Animated.createAnimatedComponent(Icon);
import Checkbox from 'expo-checkbox';

const FilaProducto = (props) => {
    const [cajas, setCajas] = useState(props.cajas);
    const [unidades, setUnidades] = useState(props.unidades);
    const [value, setValue] = useState(props.value);
    const [producto, setProducto] = useState(props.producto);
    let secondTextInput = createRef();
    let thirdTextInput = createRef();
    const fileProductos = require('./../assets/infoProductos.json');
    let productos2 = fileProductos.infoProductos

    useEffect(() =>{
        let data = {cajas, unidades, value, producto}
        props.actualizarDataFilaCallback(props.index, data)
    }, [cajas, unidades, value, producto])

    const calcularUnidades = () => {
        if (producto && producto.UNIDADES){
            let newUnidades = cajas * producto.UNIDADES
            setUnidades(newUnidades.toString());
        }
    }

    const calcularCajas = () => {
        if (producto && producto.UNIDADES){
            let newUnidades = unidades / producto.UNIDADES
            newUnidades = Math.round(newUnidades * 100) / 100
            // Redondeo a 2 decimales
            setCajas(newUnidades.toString());
        }
        props.addFilaCallback(props.index)
    }

    return (
        <View style={[styles.row, {borderBottomWidth:1}]}>
        <Dropdown
            style={[styles.dropdown, {flex:3}]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={productos2}
            search
            maxHeight={300}
            labelField="DESCRIPCION"
            valueField="id"
            placeholder="Producto"
            searchPlaceholder="Buscar..."
            value={value}
            onChange={item => {setValue(item.id); setProducto(item); calcularUnidades()}}
            onBlur={secondTextInput.focus}
            dropdownPosition="top"
            renderRightIcon={() => (null)}
            disable={!props.editable}
        />
        <TextInput
            style={styles.celda}
            onChangeText={ setCajas }
            value={cajas}
            placeholder="Cajas"
            keyboardType="numeric"
            ref={(input) => { secondTextInput = input; }}
            onBlur={calcularUnidades }
            onSubmitEditing={() => {
                calcularUnidades()
                thirdTextInput.focus();
            }}
            editable={props.editable}
        />
        <TextInput
            style={styles.celda}
            onChangeText={item => setUnidades(item) }
            value={unidades}
            placeholder="Unid"
            keyboardType="numeric"
            ref={(input) => { thirdTextInput = input; }}
            onBlur={calcularCajas}
            onSubmitEditing={calcularCajas}
            editable={props.editable}
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

export default FilaProducto

export const FilaArchivo = (props) => {
    // TODO: falta que el botón de lupa permita editar un pedido
    const [isChecked, setIsChecked] = useState(props.isChecked);
    useEffect(() =>{
        setIsChecked(props.isChecked)
    }, [props.isChecked])
    let date = new Date(props.file.fecha)

    const onChangeChecked = (newIsChecked) => {
        setIsChecked(newIsChecked);
        props.actualizarDataFilaCallback(props.index, {'isChecked':newIsChecked})
    }

    return (
        <View style={[styles.row, {borderBottomWidth:1}]}>
            <View style={{alignItems: 'center', flexDirection:"column", justifyContent:"space-around"}}>
                <Checkbox style={[{marginLeft:5}]} value={isChecked} onValueChange={onChangeChecked} color={isChecked ? '#0099ff' : undefined}/>
            </View>
            <Text style={styles.celda}>
                {props.file.cliente.title}
            </Text>
            <Text style={styles.celda}>
                {props.file.direccion.title}
            </Text>
            <Text style={styles.celda, {flex:0.6}}>
                {date.toLocaleString()}
            </Text>
            <View style={{flexDirection:"row", justifyContent:"flex-end"}}>
                <Pressable onPress={() => 
                    props.navigation.navigate('Facturacion', { 
                        cliente:props.file.cliente, 
                        direccion: props.file.direccion, 
                        dataArchivo: props.file.filas, 
                        nombreArchivo: props.nombreArchivo, 
                        })
                    } 
                >
                    <AnimatedIcon
                        name="search"
                        size={30}
                        color="#0099ff"
                        style={[styles.actionIcon, {paddingTop:8}]}
                    />
                </Pressable>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    celda: {
        height: 45,
        padding: 5,
        flex:1,
        textAlign:"left",
        textAlignVertical:"center",
        color:"black",
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
