import { StyleSheet, View, Text, TextInput, Animated, Pressable } from 'react-native';
import { createRef, Component, useState, useEffect } from "react";
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialIcons';
const AnimatedIcon = Animated.createAnimatedComponent(Icon);
import Checkbox from 'expo-checkbox';

export default class FilaEditable extends Component {
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
                disable={!this.props.editable}
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
                editable={this.props.editable}
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
                editable={this.props.editable}
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

export const FilaLectura = (props) => {
    // TODO: falta que el botón de lupa permita ver y editar un pedido
    const [isChecked, setIsChecked] = useState(props.isChecked);
    useEffect(() =>{
        setIsChecked(props.isChecked)
    }, [props.isChecked])
    let date = new Date(props.fecha)

    const onChangeChecked = (newIsChecked) => {
        setIsChecked(newIsChecked);
        props.actualizarDataFilaCallback(props.index, {'isChecked':newIsChecked})
    }

    return (
        <View style={[styles.row, {borderBottomWidth:1}]}>
            <View style={{alignItems: 'center', flexDirection:"column", justifyContent:"space-around"}}>
                <Checkbox style={[{marginHorizontal:1}]} value={isChecked} onValueChange={onChangeChecked} color={isChecked ? '#0099ff' : undefined}/>
            </View>
            <Text style={styles.celda}>
                {props.cliente.title}
            </Text>
            <Text style={styles.celda}>
                {props.direccion.title}
            </Text>
            <Text style={styles.celda, {flex:0.5}}>
                {date.toLocaleString()}
            </Text>
            <View style={{flexDirection:"row", justifyContent:"flex-end"}}>
                <Pressable onPress={() => props.navigation.navigation.navigate('Facturacion', { cliente:props.cliente, direccion: props.direccion, dataArchivo: props.filas })} >
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
