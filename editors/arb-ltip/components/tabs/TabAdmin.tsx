import { capitalCase } from 'change-case';
import { IProps } from '../../editor';
import { Role } from '../UserProvider';
import { toArray } from '../../util';
import {
    addEditor,
    removeEditor,
} from '../../../../document-models/arb-ltip-grantee/gen/creators';
import { useState } from 'react';

const RoleBadge = ({ role }: { role: Role }) => (
    <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            role === Role.Editor
                ? 'bg-green-100 text-green-800'
                : role === Role.Root
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
        }`}
    >
        {capitalCase(role)}
    </span>
);

type TabAdminProps = IProps;
const TabAdmin = (props: TabAdminProps) => {
    const [localAddress, setLocalAddress] = useState('');

    const { dispatch } = props;
    const editors = toArray(props.document.state.global.editorAddresses);

    const add = (addr: string) => {
        dispatch(addEditor({ editorAddress: addr }));
    };

    const remove = (addr: string) => {
        dispatch(removeEditor({ editorAddress: addr }));
    };

    return (
        <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto -mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                    Address
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                    Role
                                </th>
                                <th
                                    scope="col"
                                    className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                                >
                                    <span className="sr-only">Delete</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            <tr className="">
                                <td className="whitespace-nowrap py-5 pr-3 text-sm pl-0">
                                    <input
                                        type="text"
                                        className="py-1 pl-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm border-2"
                                        placeholder="Enter address"
                                        value={localAddress}
                                        onChange={e =>
                                            setLocalAddress(e.target.value)
                                        }
                                    />
                                </td>
                                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                    <RoleBadge role={Role.Editor} />
                                </td>
                                <td className="whitespace-nowrap py-5 pl-3 text-right text-sm font-medium">
                                    <p
                                        className="text-purple-600 pr-4 hover:text-purple-900 cursor-pointer"
                                        onClick={() => add(localAddress)}
                                    >
                                        Add
                                    </p>
                                </td>
                            </tr>
                            <tr className={'border-s-2'}>
                                <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm pl-0">
                                    You
                                </td>
                                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                    <RoleBadge role={Role.Root} />
                                </td>
                                <td className="whitespace-nowrap py-5 pl-3 text-right text-sm font-medium"></td>
                            </tr>
                            {editors.map((addr, index) => (
                                <tr key={index} className={'border-s-8'}>
                                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm pl-0">
                                        {addr}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                        <RoleBadge role={Role.Editor} />
                                    </td>
                                    <td className="whitespace-nowrap py-5 pl-3 text-right text-sm font-medium">
                                        <p
                                            className="text-purple-600 pr-4 hover:text-purple-900 cursor-pointer"
                                            onClick={() => remove(addr)}
                                        >
                                            Delete
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TabAdmin;
