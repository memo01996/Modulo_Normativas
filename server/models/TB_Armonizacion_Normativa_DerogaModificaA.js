module.exports = (sequelize, DataTypes) => {
    const deroga = sequelize.define("TB_Armonizacion_Normativa_DerogaModificaA", {
        CodigoResolucionModificada: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey:true,
        },
        CodigoResolucionNormativa: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey:true,
        },
        TipoModificacion: {
            type: DataTypes.STRING,
            allowNull: true,
            primaryKey:false,
        },
    }, {
        tableName: 'TB_Armonizacion_Normativa_DerogaModificaA',
        timestamps: false,
    });
    return deroga;
}