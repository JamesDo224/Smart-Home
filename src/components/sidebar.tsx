import React, { useState, useEffect } from 'react';
import { FaHome, FaCircle, FaCog, FaBars,FaSignOutAlt } from 'react-icons/fa';
import { IoPersonSharp } from "react-icons/io5";
import styles from './sidebar.module.css';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isLogin: boolean;
  userName?: string;
}

interface Device {
  id: number;
  name: string;
  feedName: string;
  state: string;
}
interface UserInfo {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
}
const Sidebar: React.FC<SidebarProps> = ({ isLogin}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  const showForm = (formType: string) => {
    setActiveForm(formType);
    // Đóng dropdown sau khi chọn form
    setIsSettingsOpen(true);
  };

  // Hàm đóng form
  const closeForm = () => {
    setActiveForm(null);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };
  const navigate = useNavigate();
  // Add this useEffect after the existing useEffect
useEffect(() => {
  const fetchUserInfo = async () => {
    try {
      const response = await fetch('https://iot-project-y7dx.onrender.com/api/v1/auth/info', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const data = await response.json();
      setUserInfo(data.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  if (isLogin) {
    fetchUserInfo();
  }
}, [isLogin]);

  useEffect(() => {
    if (activeForm === 'devicesList') {
      const fetchDevicesAndStates = async () => {
        setLoading(true);
        try {
          // 1) Fetch devices list with error handling
          const resAll = await fetch('https://iot-project-y7dx.onrender.com/api/v1/device/get-all', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
          });
  
          if (!resAll.ok) {
            throw new Error(`Failed to fetch devices: ${resAll.status} ${resAll.statusText}`);
          }
  
          const jsonAll = await resAll.json();
          const list: Omit<Device, 'state'>[] = jsonAll.data || [];
  
          // 2) Fetch states with error handling
          const withStates = await Promise.all(
            list.map(async dev => {
              try {
                const resState = await fetch(
                  `https://iot-project-y7dx.onrender.com/api/v1/device/state/${dev.feedName}`,
                  {
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                  }
                );
  
                if (!resState.ok) {
                  console.warn(`Failed to fetch state for device ${dev.feedName}`);
                  return { ...dev, state: 'Unknown' };
                }
  
                const jsonState = await resState.json();
                const rawState = jsonState.data;
  
                let stateValue: string;
                if (rawState === 1) stateValue = 'Online';
                else if (rawState === 0) stateValue = 'Offline';
                else stateValue = String(rawState);
  
                return { ...dev, state: stateValue };
              } catch (error) {
                console.error(`Error fetching state for device ${dev.feedName}:`, error);
                return { ...dev, state: 'Error' };
              }
            })
          );
  
          setDevices(withStates);
        } catch (err) {
          console.error('Fetch devices error:', err);
          setDevices([]); // Set empty array on error
        } finally {
          setLoading(false);
        }
      };
  
      fetchDevicesAndStates();
    }
  }, [activeForm]);



  return (
    <div>
      <div className={`${styles.sidebar} ${(isOpen || isSettingsOpen) ? styles.open : ''}`}>
        <div className={styles.icon} onClick={toggleSidebar}>
          <FaBars size={24} />
        </div>

        <div className={styles.iconprimary}>
          <div className={styles.iconWrapper} onClick={() => navigate('/')}>
            <div className={styles.icon1}>
              <FaHome size={24} />
            </div>
            <span className={styles.label}>Trang chủ</span>
          </div>
          {isLogin && (
            <>
              <div className={styles.iconWrapper} onClick={() => navigate('/operations')}>
                <div className={styles.icon1}>
                  <IoPersonSharp size={24} />
                </div>
                <span className={styles.label}>Trợ năng</span>
              </div>
              {/* Wrapper bao quanh nút "Cài đặt" và dropdown options */}
              <div
                className={styles.settingsWrapper}
                onMouseEnter={() => setIsSettingsOpen(true)}
                onMouseLeave={() => setIsSettingsOpen(true)}
                onClick={() => setIsSettingsOpen(true)} // Khi click, hiển thị dropdown
              >
                <div className={styles.iconWrapper} onClick={toggleSettings}>
                  <div className={styles.icon1}>
                    <FaCog size={24} />
                  </div>
                  <span className={styles.label}>Cài đặt</span>
                </div>
                {/* Dropdown các option của Cài đặt */}
                {isSettingsOpen && (
                  <div className={styles.settingsDropdown}>
                    <div
                      className={styles.dropdownItem}
                      onClick={() => showForm('accountConfig')}
                    >
                      Cấu hình tài khoản
                    </div>
                    <div
                      className={styles.dropdownItem}
                      onClick={() => showForm('addDevice')}
                    >
                      Thêm thiết bị
                    </div>
                    <div
                      className={styles.dropdownItem}
                      onClick={() => showForm('addSensor')}
                    >
                      Thêm cảm biến
                    </div>
                    <div
                      className={styles.dropdownItem}
                      onClick={() => showForm('devicesList')}
                    >
                      Danh sách thiết bị
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {isLogin && (
  <div className={styles.userWrapper}>
    <div 
      className={styles.iconperson}
      onClick={() => setShowUserModal(true)}
    >
      <FaCircle size={24} />
      <span className={styles.labelperson}>{userInfo?.username}</span>
    </div>
    <div 
      className={styles.logoutButton}
      onClick={handleLogout}
    >
      <FaSignOutAlt size={20} />

    </div>
  </div>
  
)}


      </div>
      {/* Add the user modal */}
{showUserModal && userInfo && (
  <>
    <div className={styles.overlay} onClick={closeForm} />
    <div className={styles.formContainer}>
      <div className={styles.formContent}>
        <h2>Thông tin người dùng</h2>
        <div className={styles.userInfoContent}>
          <p><strong>Tên đăng nhập:</strong> {userInfo.username}</p>
          <p><strong>Họ tên:</strong> {userInfo.fullName}</p>
          <p><strong>Số điện thoại:</strong> {userInfo.phone}</p>
          <p><strong>Địa chỉ:</strong> {userInfo.address}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
        </div>
        <button className={styles.userbutton} onClick={() => setShowUserModal(false)}>Đóng</button>
      </div>
    </div>
  </>
)}
      {/* Phần hiển thị form khi người dùng chọn option */}
      {/* Render overlay và form khi activeForm khác null */}
      {activeForm && (
        <>
          <div className={styles.overlay} onClick={closeForm} />
          <div className={styles.formContainer}>
            {activeForm === 'accountConfig' && (
              <div className={styles.formContent}>
                <h2>Cấu hình tài khoản</h2>
                <form>
                  <div className={styles.formGroup}>
                    <label>Username</label>
                    <input type="text" placeholder="Nhập username" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Userkey</label>
                    <input type="text" placeholder="Nhập userkey" />
                  </div>
                  <button type="submit">Lưu</button>
                </form>
              </div>
            )}
            {activeForm === 'addDevice' && (
              <div className={styles.formContent}>
                <h2>Thêm thiết bị</h2>
                <form>
                  <div className={styles.formGroup}>
                    <label>Feedname</label>
                    <input type="text" placeholder="Nhập feedname" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Name</label>
                    <input type="text" placeholder="Nhập name" />
                  </div>
                  <button type="submit">Lưu</button>
                </form>
              </div>
            )}
            {activeForm === 'addSensor' && (
              <div className={styles.formContent}>
                <h2>Thêm cảm biến</h2>
                <form>
                  <div className={styles.formGroup}>
                    <label>Sensor Type</label>
                    <input type="text" placeholder="Nhập loại cảm biến" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Feedname</label>
                    <input type="text" placeholder="Nhập Feedname" />
                  </div>
                  <button type="submit">Lưu</button>
                </form>
              </div>
            )}
            {activeForm === 'devicesList' && (
              <div className={styles.formContent}>
                <h2>Danh sách thiết bị</h2>

                {loading ? (
                  <p>Đang tải...</p>
                ) : (
                  <table className={styles.deviceTable}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>FeedName</th>
                        <th>State</th>
                      </tr>
                    </thead>
                    <tbody>
                      {devices.map((d) => (
                        <tr key={d.id}>
                          <td>{d.id}</td>
                          <td>{d.name}</td>
                          <td>{d.feedName}</td>
                          <td>{d.state}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <form>
                  <button type="button" onClick={closeForm}>
                    Xong
                  </button>
                </form>
              </div>
            )}
          </div>
        </>
      )}
    </div >
  );
};

export default Sidebar;
