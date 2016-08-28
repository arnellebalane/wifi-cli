function widestColumnValues(table) {
    return table.reduce((lengths, row) => {
        Object.keys(row).forEach(column => {
            if (!(column in lengths) || lengths[column] < row[column].length) {
                lengths[column] = row[column].length;
            }
        });
        return lengths;
    }, {});
}


module.exports = widestColumnValues;
