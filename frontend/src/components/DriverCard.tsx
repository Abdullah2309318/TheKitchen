import React, { memo } from 'react';
import styles from './DriverCard.module.css';

type Driver = {
  driver_id: string;
  driver_number: number;
  first_name: string;
  last_name: string;
  name_acronym: string;
  country_code: string | null;
};

interface DriverCardProps {
  driver: Driver;
}

const DriverCard: React.FC<DriverCardProps> = memo(({ driver }) => {
  // Convert country code to lowercase for flag URL, with null checking
  // Using a more reliable flag service
  const flagUrl = driver.country_code 
    ? `https://flagcdn.com/w40/${driver.country_code.toLowerCase()}.png`
    : '';
    
  // Debug: Log the driver data to see what we're getting
  console.log('Driver data:', driver);
  console.log('Country code:', driver.country_code);
  console.log('Flag URL:', flagUrl);
  
  // Temporary: Add some test flags for common F1 countries
  const testFlagUrl = flagUrl || 'https://flagcdn.com/w40/gb.png'; // Default to UK flag for testing

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.driverNumber}>
          {driver.driver_number || '?'}
        </div>
        <div className={styles.flagContainer}>
          <img 
            src={testFlagUrl} 
            alt={driver.country_code ? `${driver.country_code} flag` : 'UK flag'}
            className={styles.flag}
            loading="lazy"
            onError={(e) => {
              // Hide the image if it fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>
      
      <div className={styles.cardBody}>
        <div className={styles.driverName}>
          <span className={styles.firstName}>{driver.first_name || 'Unknown'}</span>
          <span className={styles.lastName}>{driver.last_name || 'Driver'}</span>
        </div>
        <div className={styles.nameAcronym}>
          {driver.name_acronym || 'N/A'}
        </div>
      </div>
    </div>
  );
});

DriverCard.displayName = 'DriverCard';

export default DriverCard;
