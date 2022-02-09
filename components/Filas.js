import { StyleSheet, View, Text, TextInput, Animated } from 'react-native';
import { createRef, Component } from "react";
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialIcons';
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

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

export const FilaLectura = (props) => {
    let date = new Date(props.fecha)
    return (
        <View style={[styles.row, {borderBottomWidth:1}]}>
            <Text style={styles.celda}>
                {props.cliente}
            </Text>
            <Text style={styles.celda}>
                {props.direccion}
            </Text>
            <Text style={styles.celda}>
                {date.toLocaleString()}
            </Text>
            <View style={{flexDirection:"row", justifyContent:"flex-end"}}>
                <AnimatedIcon
                    name="search"
                    size={30}
                    color="#0099ff"
                    style={[styles.actionIcon, {paddingTop:8}]}
                />
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
