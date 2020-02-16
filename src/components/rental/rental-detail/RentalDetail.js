import React from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions';
import {RentalDetailInfo} from './RentalDetailInfo';
import {RentalDetailUpdate} from './RentalDetailUpdate';
import { UserGuard } from '../../shared/auth/UserGuard';
import  RentalMap  from './RentalMap';
import  Booking  from 'components/booking/Booking';

class RentalDetail extends React.Component {
  constructor() {
    super();

    this.state = {
      isAllowed: false,
      isFetching: true
    }

    this.verifyRentalOwner = this.verifyRentalOwner.bind(this);
  }

     
    componentWillMount (){
        const rentalId = this.props.match.params.id;
        this.props.dispatch(actions.fetchRentalById(rentalId));
    }
    componentDidMount() {
      const { isUpdate } = this.props.location.state || false;
      if (isUpdate) this.verifyRentalOwner();
    }

    verifyRentalOwner() {
      const rentalId = this.props.match.params.id;
      this.setState({isFetching: true});
  
      return actions.verifyRentalOwner(rentalId).then(
        () => {
          this.setState({isAllowed: true, isFetching: false})
        },
        () => {
          this.setState({isAllowed: false, isFetching: false})
        });
    }
    
    renderRentalDetail(rental, errors){
      const { isUpdate } = this.props.location.state || false;
      const { isFetching, isAllowed } = this.state;
      return isUpdate ? <UserGuard isFetching={isFetching} isAllowed={isAllowed}>
                           <RentalDetailUpdate 
                              dispatch = {this.props.dispatch} 
                              rental={rental} 
                              errors={errors}
                              verifyUser= {this.verifyRentalOwner}/>
     
                        </UserGuard>
                          :<RentalDetailInfo rental={rental}/>;
    }

   render (){
      const {rental, errors} = this.props;
      if(rental._id){
       return (
            <section id='rentalDetails'>
            <div className='upper-section'>
              <div className='row'>
                <div className='col-md-6'>
                  <img src={rental.image} alt=''></img>
                </div>
                <div className='col-md-6'>
                  <RentalMap location = {`${rental.city},${rental.street}`}/>
                </div>
              </div>
            </div>
          
            <div className='details-section'>
              <div className='row'>
                <div className='col-md-8'>
                  {this.renderRentalDetail(rental, errors)}                 
                </div>
                <div className='col-md-4'> 
                  <Booking rental = {rental}/>
                </div>                
              </div>
            </div>
          </section>      
       )
      }else {
          return (
            <div><h1>Loading</h1></div>
          );
      }
   } 
}

function mapStateToProps(state){  
    return {        
        rental : state.rental.data,
        errors : state.rental.errors
    }    
  }

export default connect(mapStateToProps)(RentalDetail);