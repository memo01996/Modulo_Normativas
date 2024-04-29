module.exports = (sequelize, DataTypes) => {
    const Anio = sequelize.define("TB_Armonizacion_ResolucionNormativa", {
        CodigoResolucion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ClasificacionGeneral: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        PalabrasClaves: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Asunto: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        FechaEmision: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        FechaVigencia: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        FechaPublicacion: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        Observaciones: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Estado: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        SistemaFecha: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        SistemaUsuario: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Anio: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        Servicios: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
    }, {
        tableName: 'TB_Armonizacion_ResolucionNormativa',
        timestamps: false,
    });
    return Anio;
}