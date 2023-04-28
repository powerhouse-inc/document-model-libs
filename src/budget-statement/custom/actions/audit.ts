import { Operation } from '../../../document';
import { hashAttachment } from '../../../document/utils';
import {
    AddAuditReportAction,
    DeleteAuditReportAction,
    isAuditReport,
} from '../../gen/audit/types';
import { BudgetStatementDocument } from '../types';

export const addAuditReportOperation = (
    state: BudgetStatementDocument,
    action: AddAuditReportAction
) => {
    const operation = state.operations[
        state.operations.length - 1
    ] as Operation<AddAuditReportAction>;

    action.input.reports.forEach((audit, index) => {
        if (isAuditReport(audit)) {
            state.data.auditReports.push(audit);
        } else {
            const hash = hashAttachment(audit.report.data);
            const attachmentKey = `attachment://audits/${hash}` as const;
            state.fileRegistry[attachmentKey] = { ...audit.report };
            state.data.auditReports.push({
                timestamp: audit.timestamp ?? new Date().toISOString(),
                status: audit.status,
                report: attachmentKey,
            });

            operation.input.reports[index].report = attachmentKey;
        }
    });
};

export const deleteAuditReportOperation = (
    state: BudgetStatementDocument,
    action: DeleteAuditReportAction
) => {
    action.input.reports.forEach(report => {
        const index = state.data.auditReports.findIndex(
            audit => audit.report === report
        );
        if (index > -1) {
            state.data.auditReports.splice(index, 1);
        }
    });
};
