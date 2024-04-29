module.exports = (sequelize, DataTypes) => {
    const modifica = sequelize.define("TB_Armonizacion_Normativa_ModificadaPor", {
        CodigoResolucion: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey:true,
        },
        CodigoNormativaQueDerogoModifico: {
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
        tableName: 'TB_Armonizacion_Normativa_ModificadaPor',
        timestamps: false,
    });
    return modifica;
}