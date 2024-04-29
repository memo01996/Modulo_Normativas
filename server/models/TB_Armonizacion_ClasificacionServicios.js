module.exports = (sequelize, DataTypes) => {
    const clasificacion = sequelize.define("TB_Armonizacion_ClasificacionServicios", {
        CodigoResolucion: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey:true,
        },
        CodigoServicio: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey:true,
        },
    }, {
        tableName: 'TB_Armonizacion_ClasificacionServicios',
        timestamps: false,
    });
    return clasificacion;
}