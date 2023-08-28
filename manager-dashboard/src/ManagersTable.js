import React from 'react';

const ManagersTable = ({ managerData }) => {
  return (
    <div>
      <div className="selected-manager-div">
        <table className='selected-manager-table'>
          <tbody>
            {managerData ? (
              <tr key={managerData.id}>
                <td className='selected-manager-rows'>{managerData.firstName} {managerData.lastName}</td>
              </tr>
            ) : (
              <tr>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagersTable;