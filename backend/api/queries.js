module.exports = (app) => {
    function LimitOFFSET(page, limit) {
        const _limit = limit && (limit > 0) ? limit : 10;
        const _page = page && (page > 0) ? page : 1;

        return `LIMIT ${_limit} OFFSET ${_page * _limit - _limit}`;
    }

    function orderBy(coluna, asc_desc) {
        const _ASC_DESC = asc_desc ? asc_desc : "ASC";

        if (coluna) return `ORDER BY ${coluna} ${_ASC_DESC}`;
    }

    const whereNullDeleted = "WHERE deleted_at IS NULL";

    return { LimitOFFSET, orderBy, whereNullDeleted };
};
