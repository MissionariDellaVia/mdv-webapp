<template>
  <section>
    <MDHeader image="contatti.jpg" title="Contatti"/>
    <div class="container">

      <div class="row my-4">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header">
              <div class="text-center fs-2">Lamezia Terme (CZ)</div>
            </div>
            <div class="card-body">
              <div class="row my-4">
                <div class="col col-lg-12 align-self-start">
                  <BaseMap :lat="38.932440" :lng="16.335970"></BaseMap>
                </div>
              </div>
              <div class="row my-4">
                <div class="col col-lg-4">
                  <MdvContactoButton>
                    <template v-slot:card-header>
                      <i class="fa-solid fa-location-dot"></i>
                    </template>
                    <template v-slot:body>
                      <p class="fw-bold">Chiesa di S. Chiara</p>
                      <p>Via Gen. F. Scalzo 7</p>
                      <p>88046 Lamezia Terme (CZ)</p>
                    </template>
                  </MdvContactoButton>
                </div>
                <div class="col col-lg-4">
                  <MdvContactoButton>
                    <template v-slot:card-header>
                      <i class="fa-solid fa-phone"></i>
                    </template>
                    <template v-slot:body>
                      <p class="fw-bold"></p>
                      <p><strong>Telefono:</strong><br><a href="tel:0968453462">0968.453462</a></p>
                    </template>
                  </MdvContactoButton>
                </div>
                <div class="col col-lg-4">
                  <MdvContactoButton>
                    <template v-slot:card-header>
                      <i class="fa-regular fa-envelope"></i>
                    </template>
                    <template v-slot:body>
                      <p><strong>Frati:</strong><br><a href="mailto:missionaridellavia.lamezia@gmail.com">missionaridellavia.lamezia@gmail.com</a></p>
                      <p><strong>Suore:</strong><br><a href="mailto:missionariedellavia.lamezia@gmail.com">missionariedellavia.lamezia@gmail.com</a></p>
                    </template>
                  </MdvContactoButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-12">
          <div class="card">
            <div class="card-header">
              <div class="text-center fs-2">Napoli</div>
            </div>
            <div class="card-body">
              <div class="row my-4">
                <div class="col col-lg-12 align-self-start">
                  <BaseMap :lat="40.838620" :lng="14.237410"></BaseMap>
                </div>
              </div>
              <div class="row my-4">
                <div class="col col-lg-4">
                  <MdvContactoButton>
                    <template v-slot:card-header>
                      <i class="fa-solid fa-location-dot"></i>
                    </template>
                    <template v-slot:body>
                      <p class="fw-bold">Chiesa di S. Maria dell’Anima</p>
                      <p>Via del Parco Regina Margherita 26</p>
                      <p>80121 Napoli</p>
                    </template>
                  </MdvContactoButton>
                </div>
                <div class="col col-lg-4">
                  <MdvContactoButton>
                    <template v-slot:card-header>
                      <i class="fa-solid fa-phone"></i>
                    </template>
                    <template v-slot:body>
                      <p class="fw-bold"></p>
                      <p><strong>Telefono:</strong><br><a href="tel:0813792864">081.3792864</a></p>
                    </template>
                  </MdvContactoButton>
                </div>
                <div class="col col-lg-4">
                  <MdvContactoButton>
                    <template v-slot:card-header>
                      <i class="fa-regular fa-envelope"></i>
                    </template>
                    <template v-slot:body>
                      <p><strong>Frati:</strong><br><a href="mailto:missionaridellavia.napoli@gmail.com">missionaridellavia.napoli@gmail.com</a></p>
                      <p><strong>Suore:</strong><br><a href="mailto:missionariedellavia.napoli@gmail.com">missionariedellavia.napoli@gmail.com</a></p>
                    </template>
                  </MdvContactoButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row my-4">
        <MdvForm title="Manda qui la tua richiesta di informazioni o di preghiera"></MdvForm>
      </div>


    </div>
  </section>
</template>

<script>
import MDHeader from "@/components/layout/MdvHeader";
import MdvContactoButton from "@/components/MdvContactButton";
import BaseMap from "@/components/ui/BaseMap";
import MdvForm from "@/components/MdvForm";

export default {
  name: "HomePage",
  components: {MdvForm, BaseMap, MDHeader, MdvContactoButton}
}
</script>

<style scoped>
.card {
  border: 0;
}
.card-header{
  font-family: 'Playfair Display', sans-serif;
  color: #fff;
  border: 0;
  background: rgb(40, 29, 2, 0.9);
}
a {
  text-decoration: none;
  color: #8c681c;
  margin-bottom: 1.2rem;
}
a:hover, a:focus {
  color: #59411a;
}
</style>